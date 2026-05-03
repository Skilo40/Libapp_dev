import Book from '../models/Book.js';
import { audit } from '../services/auditService.js';

export const getBooks = async (req, res, next) => {
  try {
    const { search, genre, bookLanguage, available } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { isbn: { $regex: search, $options: 'i' } },
      ];
    }
    if (genre) filter.genre = genre;
    if (bookLanguage) filter.bookLanguage = bookLanguage;
    if (available === 'true') filter.availableCopies = { $gt: 0 };

    const books = await Book.find(filter).sort({ createdAt: -1 });
    res.json({ books, total: books.length });
  } catch (err) {
    next(err);
  }
};

export const getBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Книгу не знайдено' });
    res.json({ book });
  } catch (err) {
    next(err);
  }
};

export const createBook = async (req, res, next) => {
  try {
    const book = await Book.create({ ...req.body, addedBy: req.user._id });

    await audit({
      action: 'BOOK_CREATED',
      entityType: 'book',
      entityId: book._id,
      performedBy: req.user._id,
      newValue: req.body,
      ip: req.ip,
    });

    res.status(201).json({ book });
  } catch (err) {
    next(err);
  }
};

export const updateBook = async (req, res, next) => {
  try {
    const old = await Book.findById(req.params.id);
    if (!old) return res.status(404).json({ message: 'Книгу не знайдено' });

    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    await audit({
      action: 'BOOK_UPDATED',
      entityType: 'book',
      entityId: book._id,
      performedBy: req.user._id,
      oldValue: old.toObject(),
      newValue: req.body,
      ip: req.ip,
    });

    res.json({ book });
  } catch (err) {
    next(err);
  }
};

export const deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Книгу не знайдено' });

    await Book.findByIdAndDelete(req.params.id);

    await audit({
      action: 'BOOK_DELETED',
      entityType: 'book',
      entityId: book._id,
      performedBy: req.user._id,
      oldValue: book.toObject(),
      ip: req.ip,
    });

    res.json({ message: 'Книгу видалено' });
  } catch (err) {
    next(err);
  }
};