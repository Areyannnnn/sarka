// Loads the invitation details (couple, venue, celebrations) into the database.
// Safe to re-run: it only fills fields that are still empty, so edits made in the admin
// dashboard survive. Pass --force to overwrite everything with the values below.
//   npm run seed                       -> uses MONGO_URI from server/.env
//   npm run seed -- --force
//   MONGO_URI=mongodb://... npm run seed
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import SiteSettings from './models/SiteSettings.js';
import Event from './models/Event.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/wedding';
const FORCE = process.argv.includes('--force');

// Values a fresh document is created with, which count as "not filled in yet".
const PLACEHOLDERS = new Set(['', 'Bride & Groom', 'Our story begins...']);
const isUnset = (doc, key) => {
  const value = doc.get(key);
  if (value === null || value === undefined || value === 0) return true;
  if (typeof value === 'string') return PLACEHOLDERS.has(value.trim());
  return key === 'weddingDate' && doc.createdAt && Math.abs(value - doc.createdAt) < 60_000;
};

function fill(doc, values) {
  const changed = [];
  for (const [key, value] of Object.entries(values)) {
    if (FORCE || isUnset(doc, key)) {
      doc.set(key, value);
      changed.push(key);
    }
  }
  return changed;
}

const settings = {
  coupleNames: 'Saurav & Alka',
  tagline: 'From school days in Mumbai to forever by the Pacific.',
  // Countdown runs to the first celebration: Haldi, 1:00 pm IST on 17 January.
  weddingDate: new Date('2027-01-17T13:00:00+05:30'),
  rsvpDeadline: new Date('2026-12-20'),
  heroImageUrl: '/images/story/proposal-hero.webp',
  story:
    'We grew up together, built dreams in different cities, and kept finding our way back to one another.',
  welcomeNote:
    'Our story began in a school in Mumbai, and it has travelled through Illinois, Buffalo, San Francisco and Philadelphia before finding its way home.\n\nNow we would love nothing more than to have you beside us by the lake in Daman — for two days of colour, music and celebration, as we begin our next chapter together.',
  venueName: 'Praveg Lake Resort',
  venueAddress: 'Kachigam, Daman, India',
  lat: 20.383945,
  lng: 72.872849,
};

const events = [
  {
    title: 'Haldi',
    description:
      'A sunlit afternoon of turmeric, music and playful celebration. Come ready for color, laughter and a little joyful mess.',
    date: new Date('2027-01-17'),
    time: '1:00 to 4:00 pm',
    location: 'Praveg Lake Resort',
    theme: 'Carnival',
    dressCode: 'Wear joyful shades of yellow.',
    wardrobe: 'haldi',
    sortIndex: 1,
  },
  {
    title: 'Sangeet',
    description:
      'An evening of performances, dancing and Indian party glamour. Dress for the lights and stay for the dance floor.',
    date: new Date('2027-01-17'),
    time: '7:00 to 11:00 pm',
    location: 'Praveg Lake Resort',
    theme: 'Indian Party',
    dressCode: 'Bring the bling in black, blue or magenta.',
    wardrobe: 'sangeet',
    sortIndex: 2,
  },
  {
    title: 'Baraat & Wedding',
    description:
      'A lively baraat followed by our lakeside wedding ceremony. Join us for a royal afternoon of music, rituals and celebration.',
    date: new Date('2027-01-18'),
    time: 'Baraat begins at 2:00 pm',
    location: 'Praveg Lake Resort',
    theme: 'Royalty',
    dressCode: 'Choose royal daytime colors. Anything but red or yellow.',
    wardrobe: 'wedding',
    sortIndex: 3,
  },
];

const describe = (changed) => (changed.length ? `updated ${changed.join(', ')}` : 'already filled in, left as is');

await mongoose.connect(MONGO_URI);
try {
  const doc = (await SiteSettings.findOne()) || new SiteSettings();
  const changed = fill(doc, settings);
  await doc.save();
  console.log(`Settings: ${describe(changed)}`);

  for (const event of events) {
    const existing = await Event.findOne({ title: event.title });
    if (!existing) {
      await Event.create(event);
      console.log(`Event added: ${event.title}`);
      continue;
    }
    const eventChanged = fill(existing, event);
    await existing.save();
    console.log(`Event ${event.title}: ${describe(eventChanged)}`);
  }
} finally {
  await mongoose.disconnect();
}
