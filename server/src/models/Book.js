import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  author: { type: String, required: true, trim: true },
  isbn: { type: String, required: true, unique: true, trim: true },
  genre: { type: String, trim: true },
  year: { type: Number },
  description: { type: String },
  totalCopies: { type: Number, required: true, min: 0, default: 1 },
  availableCopies: { type: Number, required: true, min: 0, default: 1 },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

bookSchema.index({ title: 'text', author: 'text', isbn: 1 });

export default mongoose.model('Book', bookSchema);