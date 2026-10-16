import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    date: { type: Date, required: true },
    time: { type: String, default: '' },
    location: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    theme: { type: String, default: '' },
    dressCode: { type: String, default: '' },
    // Links the event to a wardrobe planner and colour theme on the site: haldi | sangeet | wedding.
    wardrobe: { type: String, default: '' },
    sortIndex: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Event', eventSchema);
