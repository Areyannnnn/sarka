import mongoose from 'mongoose';

const rsvpSchema = new mongoose.Schema(
  {
    guestName: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, default: '', trim: true, maxlength: 200 },
    phone: { type: String, default: '', trim: true, maxlength: 40 },
    numberOfGuests: { type: Number, default: 1, min: 0, max: 20 },
    attending: { type: String, enum: ['yes', 'no'], default: 'yes' },
    events: { type: [String], default: [] },
    needsTransport: { type: String, enum: ['yes', 'no', ''], default: '' },
    message: { type: String, default: '', maxlength: 2000 },
  },
  { timestamps: true }
);

export default mongoose.model('Rsvp', rsvpSchema);
