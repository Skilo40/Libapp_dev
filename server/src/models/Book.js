import mongoose from 'mongoose';
import { generateTrigrams } from '../services/trigramService.js';

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  author: { type: String, required: true, trim: true },
  isbn: { type: String, required: true, unique: true, trim: true },
  genre: { type: String, trim: true },
  year: { type: Number },
  description: { type: String },
  bookLanguage: { type: String, default: 'Українська' },
  pages: { type: Number },
  coverUrl: { type: String },
  totalCopies: { type: Number, required: true, min: 0, default: 1 },
  availableCopies: { type: Number, required: true, min: 0, default: 1 },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  trigrams: [String], // Триграми з назви для швидкого пошуку
}, { timestamps: true });

// Автоматично генеруємо триграми перед збереженням
bookSchema.pre('save', async function () {
  if (this.isModified('title')) {
    this.trigrams = generateTrigrams(this.title);
  }
});

bookSchema.index({ title: 'text', author: 'text' });
bookSchema.index({ trigrams: 1 });

export default mongoose.model('Book', bookSchema);