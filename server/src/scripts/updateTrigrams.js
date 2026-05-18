import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Book from '../models/Book.js';
import { generateTrigrams } from '../services/trigramService.js';

dotenv.config();

const updateTrigrams = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Підключено до MongoDB');

    // Отримуємо всі книги без триграм або з порожніми триграмами
    const books = await Book.find({
      $or: [
        { trigrams: { $exists: false } },
        { trigrams: { $size: 0 } },
      ],
    });

    if (books.length === 0) {
      console.log('Все книги вже мають триграми');
      await mongoose.disconnect();
      return;
    }

    console.log(`Знайдено ${books.length} книг для оновлення`);

    let updated = 0;
    for (const book of books) {
      book.trigrams = generateTrigrams(book.title);
      await book.save();
      updated++;
      console.log(`✓ ${updated}/${books.length} - "${book.title}"`);
    }

    console.log(`\n✅ Успішно оновлено ${updated} книг`);
    await mongoose.disconnect();
  } catch (err) {
    console.error('Помилка:', err);
    process.exit(1);
  }
};

updateTrigrams();
