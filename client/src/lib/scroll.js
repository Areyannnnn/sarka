// Native scrolling throughout: the browser scrolls on its compositor thread, so it stays smooth
// even while the page is busy animating. Sections carry scroll-margin-top for the fixed navbar.
let locks = 0;

const gutterColors = [];

// Reference-counted so stacked overlays (the intro, the menu, a lightbox) release correctly.
// scrollbar-gutter: stable (index.css) keeps the page from shifting when the scrollbar hides; the
// reserved strip shows the root background, so it takes the overlay's colour while one is open.
export function lockScroll({ color } = {}) {
  const root = document.documentElement;
  locks += 1;
  if (locks === 1) root.style.overflow = 'hidden';
  gutterColors.push(color);
  if (color) root.style.setProperty('--gutter', color);
  let released = false;
  return () => {
    if (released) return;
    released = true;
    locks = Math.max(0, locks - 1);
    gutterColors.splice(gutterColors.lastIndexOf(color), 1);
    const previous = gutterColors.filter(Boolean).at(-1);
    if (previous) root.style.setProperty('--gutter', previous);
    else root.style.removeProperty('--gutter');
    if (locks === 0) root.style.overflow = '';
  };
}

export function scrollToId(id, { immediate = false } = {}) {
  document.getElementById(id)?.scrollIntoView({ behavior: immediate ? 'instant' : 'smooth', block: 'start' });
}

export function scrollToY(y, { immediate = true } = {}) {
  window.scrollTo({ top: y, behavior: immediate ? 'instant' : 'smooth' });
}
