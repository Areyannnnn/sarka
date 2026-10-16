// Copy and imagery for the invitation that doesn't change through the admin dashboard.

export const mapsUrl = (query) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

const story = (name) => `/images/story/${name}.webp`;

export const STORY_CHAPTERS = [
  {
    number: '01',
    place: 'Mumbai',
    title: 'Where we began',
    body: 'We met in school in Mumbai and fell in love while growing up side by side. These imperfect little photographs hold the beginning of everything.',
    collage: {
      caption: 'Growing up together',
      layout: 'tall',
      photos: [
        { src: story('school-night'), alt: 'Saurav and Alka together during their school years' },
        { src: story('school-selfie'), alt: 'A school-years selfie of Saurav and Alka' },
        { src: story('school-cafe'), alt: 'Saurav and Alka sitting across a cafe table' },
      ],
    },
  },
  {
    number: '02',
    place: 'UIUC → Buffalo',
    title: 'Different ways forward',
    body: 'Saurav was the first to leave Mumbai, setting off on a new journey at the University of Illinois Urbana-Champaign. A little later, Alka embarked on her own adventure at the University at Buffalo. Having grown up side by side, life led us to different cities, where we began chasing our individual dreams and writing new chapters of our stories.',
    collage: {
      caption: 'Winters, miles & midnight calls',
      layout: 'tall',
      photos: [
        { src: story('city-selfie'), alt: 'Saurav and Alka together in the city', focus: '50% 35%' },
        { src: story('winter-hearts'), alt: 'Saurav and Alka beneath illuminated hearts in the snow' },
        { src: story('dancing-street'), alt: 'Saurav and Alka dancing together', focus: '50% 70%' },
      ],
    },
  },
  {
    number: '03',
    place: 'San Francisco',
    title: 'Westward, together',
    body: 'Saurav moved to San Francisco. Alka came to visit, turning flights and borrowed weekends into memories along the California coast.',
    feature: 'boarding-pass',
  },
  {
    number: '04',
    place: 'The Pacific',
    title: 'The easiest yes',
    body: 'On the beach in California, the long-distance story became a promise. A ring, the ocean, and the beginning of the next chapter.',
    collage: {
      layout: 'pair',
      photos: [
        { src: story('proposal-beach'), alt: 'The beach proposal', focus: '50% 60%' },
        { src: story('proposal-ring'), alt: 'The engagement ring' },
      ],
    },
  },
  {
    number: '05',
    place: 'Philadelphia → California',
    title: 'The distance ends here',
    body: 'Alka is in Philadelphia today. After the wedding, she will move to California, and for the first time, home will be the same place.',
    feature: 'distance',
  },
];

export const TRAVEL_STEPS = [
  {
    label: 'Arrive',
    code: 'BOM',
    title: 'Mumbai Airport',
    body: 'Mumbai is the best airport for guests traveling to the wedding.',
  },
  {
    label: 'Celebrate',
    code: 'Daman',
    title: 'Daman',
    body: 'We will arrange transportation from Mumbai to Daman and back. Pickup details will be shared with guests.',
  },
];

export const VENUE_BLURB =
  'A quiet lakeside setting reserved for our celebration, where every event unfolds in one beautiful place.';

export const EXPLORE = [
  {
    city: 'Daman',
    note: 'Near the venue',
    places: [
      { name: 'Moti Daman Fort', note: 'A historic fort and an atmospheric walk through old Daman.', query: 'Moti Daman Fort, Daman' },
      { name: 'Jampore Beach', note: 'A relaxed stretch of coast for a slow afternoon by the sea.', query: 'Jampore Beach, Daman' },
      { name: 'Lighthouse Beach', note: 'A waterfront promenade suited to an evening stroll.', query: 'Lighthouse Beach, Daman' },
    ],
  },
  {
    city: 'Mumbai',
    note: 'Around your flights',
    places: [
      { name: 'Marine Drive', note: 'Walk the Queen’s Necklace at sunset and watch the city light up.', query: 'Marine Drive, Mumbai' },
      { name: 'Gateway of India', note: 'Begin a South Mumbai wander at the city’s landmark waterfront arch.', query: 'Gateway of India, Mumbai' },
      { name: 'Elephanta Caves', note: 'Take a harbour ferry to centuries-old rock-cut cave temples.', query: 'Elephanta Caves, Mumbai' },
    ],
  },
];

export const outfitSrc = (slug, outfit) => `/images/wardrobe/${slug}/${outfit}.webp`;

// Keyed by an event's `wardrobe` field.
export const WARDROBE = {
  haldi: {
    title: 'Haldi',
    intro: 'Sunlit yellows, easy silhouettes and clothes made for a joyful afternoon of haldi, music and celebration.',
    colorNote: 'Wear any shade of yellow, from soft lemon to marigold.',
    swatches: [
      { hex: '#fff0a8', name: 'Lemon' },
      { hex: '#fdd75a', name: 'Sunflower' },
      { hex: '#f8c01d', name: 'Turmeric' },
      { hex: '#f2a900', name: 'Marigold' },
      { hex: '#e58e00', name: 'Saffron' },
    ],
    featured: ['lehenga', 'long-kurta'],
    outfits: [
      { id: 'long-kurta', name: 'Long kurta & pajama', note: 'Simple, airy and traditional' },
      { id: 'short-kurta', name: 'Short kurta & pants', note: 'Relaxed with a modern line' },
      { id: 'nehru', name: 'Nehru jacket set', note: 'Layered over kurta pajama' },
      { id: 'salwar', name: 'Salwaar kameez', note: 'Easy movement with a flowing dupatta' },
      { id: 'sharara', name: 'Sharara / garara', note: 'Festive volume and playful movement' },
      { id: 'lehenga', name: 'Simple lehenga', note: 'Light, graceful and celebration-ready' },
    ],
  },
  sangeet: {
    title: 'Sangeet',
    intro: 'Deep jewel tones, glimmering details and dance-floor silhouettes for a night of music and movement.',
    colorNote: 'Choose black, deep blue or magenta, with tasteful shine.',
    swatches: [
      { hex: '#111014', name: 'Black' },
      { hex: '#1e2a6e', name: 'Midnight' },
      { hex: '#2d4fb3', name: 'Sapphire' },
      { hex: '#b3146b', name: 'Magenta' },
      { hex: '#d42a86', name: 'Fuchsia' },
    ],
    featured: ['lehenga', 'bandhgala'],
    outfits: [
      { id: 'bandhgala', name: 'Embroidered bandhgala', note: 'Black tailoring with subtle sparkle' },
      { id: 'asymmetric', name: 'Asymmetric kurta', note: 'Midnight blue with a sharp trouser' },
      { id: 'black-suit', name: 'Black evening suit', note: 'Sharp tailoring with a touch of sparkle' },
      { id: 'sari', name: 'Sequin sari', note: 'A dark, fluid silhouette for dancing' },
      { id: 'sharara', name: 'Cape sharara', note: 'Sapphire movement with a little shine' },
      { id: 'lehenga', name: 'Festive lehenga', note: 'Magenta volume and tonal embellishment' },
    ],
  },
  wedding: {
    title: 'Baraat & Wedding',
    intro: 'Regal Indian occasionwear in luminous daytime color: formal, celebratory and distinctly your own.',
    colorNote: 'Any daytime color except red or yellow. Pastels and vivid brights are welcome.',
    swatches: [
      { hex: '#a9c6e8', name: 'Powder blue' },
      { hex: '#2a4b9b', name: 'Royal blue' },
      { hex: '#a8bfa0', name: 'Sage' },
      { hex: '#c8b6e2', name: 'Lilac' },
      { hex: '#e0408a', name: 'Hot pink' },
      { hex: '#f08070', name: 'Coral' },
    ],
    avoid: [
      { hex: '#c8102e', name: 'Red' },
      { hex: '#f8c01d', name: 'Yellow' },
    ],
    featured: ['lilac', 'sherwani'],
    outfits: [
      { id: 'sherwani', name: 'Pastel sherwani', note: 'Powder blue with refined detailing' },
      { id: 'achkan', name: 'Royal blue achkan', note: 'A strong formal silhouette' },
      { id: 'sage', name: 'Sage jacket set', note: 'Soft green layers for the afternoon' },
      { id: 'pink', name: 'Hot-pink lehenga', note: 'Bright, joyful and unapologetic' },
      { id: 'lilac', name: 'Lilac anarkali', note: 'Pastel volume with a regal line' },
      { id: 'saree', name: 'Coral-pink saree', note: 'Elegant silk pleats and golden detailing' },
    ],
  },
};

export const WARDROBE_ORDER = ['haldi', 'sangeet', 'wedding'];
