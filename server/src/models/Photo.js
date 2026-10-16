import mongoose from 'mongoose';

const photoSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    caption: { type: String, default: '' },
    category: { type: String, default: 'gallery' },
  },
  { timestamps: true }
);

export default mongoose.model('Photo', photoSchema);
