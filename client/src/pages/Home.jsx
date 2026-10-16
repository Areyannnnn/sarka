import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useLocation, useNavigationType } from 'react-router-dom';
import IntroGate from '../components/IntroGate';
import ScrollProgress from '../components/ScrollProgress';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import WelcomeLetter from '../components/WelcomeLetter';
import Story from '../components/Story';
import Interlude from '../components/Interlude';
import Events from '../components/Events';
import Travel from '../components/Travel';
import Venue from '../components/Venue';
import Gallery from '../components/Gallery';
import RsvpForm from '../components/RsvpForm';
import Explore from '../components/Explore';
import Footer from '../components/Footer';
import { getSettings, getEvents, getPhotos } from '../lib/api';
import { formatDayRange, venueCity } from '../lib/format';
import { scrollToId, scrollToY } from '../lib/scroll';

const GATE_KEY = 'invitation-opened';
const SCROLL_KEY = 'invitation-scroll';

// Session storage can be unavailable (private mode, blocked storage); these just become no-ops.
const session = {
  get(key) {
    try {
      return sessionStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      sessionStorage.setItem(key, value);
    } catch {
      // ignore
    }
  },
};

// Hold the reveal until the web fonts are in, so no headline visibly swaps typeface.
function useFontsReady(timeout = 1500) {
  const [ready, setReady] = useState(() => document.fonts?.status === 'loaded');
  useEffect(() => {
    if (ready) return undefined;
    let done = false;
    const finish = () => {
      if (!done) {
        done = true;
        setReady(true);
      }
    };
    document.fonts?.ready.then(finish);
    const timer = setTimeout(finish, timeout);
    return () => clearTimeout(timer);
  }, [ready, timeout]);
  return ready;
}

export default function Home() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const fontsReady = useFontsReady();
  const [settings, setSettings] = useState(null);
  const [events, setEvents] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [loaded, setLoaded] = useState(false);
  // Deep links (e.g. "/#rsvp" from a wardrobe page) and returning visitors skip the doors.
  const [gateOpen, setGateOpen] = useState(() => !location.hash && session.get(GATE_KEY) !== '1');
  const [opened, setOpened] = useState(!gateOpen);
  const restored = useRef(false);
  const revealed = opened && fontsReady;

  useEffect(() => {
    Promise.allSettled([getSettings(), getEvents(), getPhotos()]).then(([s, e, p]) => {
      if (s.status === 'fulfilled') setSettings(s.value);
      if (e.status === 'fulfilled') setEvents(e.value);
      if (p.status === 'fulfilled') setPhotos(p.value);
      setLoaded(true);
    });
  }, []);

  const dateLine = formatDayRange(events, settings?.weddingDate);

  useEffect(() => {
    if (!settings?.coupleNames) return;
    const city = venueCity(settings.venueAddress);
    document.title = [settings.coupleNames, city && `Wedding in ${city}`, dateLine].filter(Boolean).join(' · ');
  }, [settings, dateLine]);

  // Remember where the guest was, so coming back from a wardrobe page lands in the same place.
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    const save = () => session.set(SCROLL_KEY, String(window.scrollY));
    window.addEventListener('pagehide', save);
    return () => {
      window.removeEventListener('pagehide', save);
      save();
    };
  }, []);

  // Once content is in: honour a "#section" deep link, or restore the position on Back.
  // A second pass catches late layout shifts, unless the guest has already started scrolling.
  useEffect(() => {
    if (!loaded || restored.current) return undefined;
    restored.current = true;
    const hash = decodeURIComponent(location.hash.slice(1));
    const saved = Number(session.get(SCROLL_KEY));
    const go = () => {
      if (hash) scrollToId(hash, { immediate: true });
      else if (navigationType === 'POP' && saved > 0) scrollToY(saved);
    };
    if (!hash && !(navigationType === 'POP' && saved > 0)) return undefined;
    let userScrolled = false;
    const onInput = () => (userScrolled = true);
    const inputs = ['wheel', 'touchstart', 'keydown'];
    inputs.forEach((type) => window.addEventListener(type, onInput, { passive: true, once: true }));
    const first = setTimeout(go, 60);
    const second = setTimeout(() => !userScrolled && go(), 800);
    return () => {
      clearTimeout(first);
      clearTimeout(second);
      inputs.forEach((type) => window.removeEventListener(type, onInput));
    };
  }, [loaded, location.hash, navigationType]);

  const reveal = useCallback(() => setOpened(true), []);
  const closeGate = useCallback(() => {
    session.set(GATE_KEY, '1');
    setOpened(true);
    setGateOpen(false);
  }, []);

  return (
    <div className="relative">
      <AnimatePresence>
        {gateOpen && (
          <IntroGate key="gate" settings={settings} dateLine={dateLine} onReveal={reveal} onOpen={closeGate} />
        )}
      </AnimatePresence>
      <ScrollProgress visible={revealed} />
      <Navbar settings={settings} showGallery={photos.length > 0} revealed={revealed} />
      <main className="relative z-10">
        <Hero settings={settings} events={events} revealed={revealed} />
        <WelcomeLetter settings={settings} />
        <Story settings={settings} />
        <Interlude settings={settings} events={events} />
        <Events events={events} settings={settings} />
        <Travel />
        <Venue settings={settings} events={events} />
        {photos.length > 0 && <Gallery photos={photos} />}
        <RsvpForm events={events} settings={settings} />
        <Explore />
      </main>
      <Footer settings={settings} events={events} />
    </div>
  );
}
