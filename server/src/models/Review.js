import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  authorName: { type: String, required: true },
  text: { type: String, required: true },
  rating: { type: Number, required: true, min: 0, max: 5 },
}, { timestamps: true });

export default mongoose.model('Review', reviewSchema);