import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema(
  {
    coupleNames: { type: String, default: 'Bride & Groom' },
    tagline: { type: String, default: '' },
    // The moment the countdown runs to (stored as an exact instant, not a calendar day).
    weddingDate: { type: Date, default: () => new Date() },
    rsvpDeadline: { type: Date, default: null },
    heroImageUrl: { type: String, default: '' },
    story: { type: String, default: 'Our story begins...' },
    // The couple's letter to guests, shown under the hero and signed with their names.
    welcomeNote: { type: String, default: '' },
    venueName: { type: String, default: '' },
    venueAddress: { type: String, default: '' },
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 },
    mapFileUrl: { type: String, default: '' },
    contactInfo: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('SiteSettings', siteSettingsSchema);
