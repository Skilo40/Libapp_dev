import Book from '../models/Book.js';
import Review from '../models/Review.js';

export const getBooks = async (req, res, next) => {
  try {
    const { search, genre, language, available, sortBy = 'createdAt', order = 'desc' } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { isbn: { $regex: search, $options: 'i' } },
      ];
    }
    if (genre) filter.genre = genre;
    if (language) filter.language = language;
    if (available === 'true') filter.availableCopies = { $gt: 0 };

    const sortOrder = order === 'asc' ? 1 : -1;
    const books = await Book.find(filter).sort({ [sortBy]: sortOrder });

    res.json({ books, total: books.length });
  } catch (err) {
    next(err);
  }
};

export const getBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Книгу не знайдено' });

    const reviews = await Review.find({ book: req.params.id })
      .populate('member', 'firstName lastName avatarUrl')
      .sort({ createdAt: -1 });

    const avgRating = reviews.length
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    const similar = await Book.find({
      genre: book.genre,
      _id: { $ne: book._id },
    }).limit(4);

    res.json({ book, reviews, avgRating: Math.round(avgRating * 10) / 10, similar });
  } catch (err) {
    next(err);
  }
};

export const createReview = async (req, res, next) => {
  try {
    const { authorName, text, rating, memberId } = req.body;
    const review = await Review.create({
      book: req.params.id,
      member: memberId || null,
      authorName,
      text,
      rating,
    });
    res.status(201).json({ review });
  } catch (err) {
    next(err);
  }
};

export const getGenres = async (req, res, next) => {
  try {
    const genres = await Book.distinct('genre');
    const languages = await Book.distinct('language');
    res.json({ genres: genres.filter(Boolean), languages: languages.filter(Boolean) });
  } catch (err) {
    next(err);
  }
};