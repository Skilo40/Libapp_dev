import Book from '../models/Book.js';
import Loan from '../models/Loan.js';
import Member from '../models/Member.js';
import AuditLog from '../models/AuditLog.js';
import { audit } from '../services/auditService.js';

export const updateLoanDates = async (req, res, next) => {
  try {
    const { issueDate, dueDate, returnDate, status, notes } = req.body;
    const old = await Loan.findById(req.params.id);
    if (!old) return res.status(404).json({ message: 'Позику не знайдено' });

    const updated = await Loan.findByIdAndUpdate(
      req.params.id,
      { issueDate, dueDate, returnDate, status, notes },
      { new: true, runValidators: true }
    ).populate('book', 'title').populate('member', 'firstName lastName');

    await audit({
      action: 'LOAN_UPDATED',
      entityType: 'loan',
      entityId: updated._id,
      performedBy: req.user._id,
      oldValue: old.toObject(),
      newValue: req.body,
      ip: req.ip,
    });

    res.json({ loan: updated });
  } catch (err) {
    next(err);
  }
};

export const updateStock = async (req, res, next) => {
  try {
    const { quantity, reason } = req.body;
    const old = await Book.findById(req.params.id);
    if (!old) return res.status(404).json({ message: 'Книгу не знайдено' });

    if (quantity < 0 && old.availableCopies + quantity < 0) {
      return res.status(400).json({ message: 'Недостатньо доступних копій' });
    }

    const book = await Book.findByIdAndUpdate(
      req.params.id,
      {
        $inc: {
          totalCopies: quantity,
          availableCopies: quantity,
        },
      },
      { new: true }
    );

    await audit({
      action: 'STOCK_UPDATED',
      entityType: 'stock',
      entityId: book._id,
      performedBy: req.user._id,
      oldValue: { totalCopies: old.totalCopies, availableCopies: old.availableCopies },
      newValue: { totalCopies: book.totalCopies, availableCopies: book.availableCopies, reason },
      ip: req.ip,
    });

    res.json({ book });
  } catch (err) {
    next(err);
  }
};

export const addStockLot = async (req, res, next) => {
  try {
    const { isbn, title, author, genre, year, description, quantity } = req.body;

    let book = await Book.findOne({ isbn });

    if (book) {
      const old = book.toObject();
      book.totalCopies += quantity;
      book.availableCopies += quantity;
      await book.save();

      await audit({
        action: 'STOCK_UPDATED',
        entityType: 'stock',
        entityId: book._id,
        performedBy: req.user._id,
        oldValue: old,
        newValue: { totalCopies: book.totalCopies, availableCopies: book.availableCopies },
        ip: req.ip,
      });
    } else {
      book = await Book.create({
        isbn, title, author, genre, year, description,
        totalCopies: quantity,
        availableCopies: quantity,
        addedBy: req.user._id,
      });

      await audit({
        action: 'BOOK_CREATED',
        entityType: 'book',
        entityId: book._id,
        performedBy: req.user._id,
        newValue: req.body,
        ip: req.ip,
      });
    }

    res.status(201).json({ book });
  } catch (err) {
    next(err);
  }
};

export const getAuditLogs = async (req, res, next) => {
  try {
    const { entityType, action, from, to, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (entityType) filter.entityType = entityType;
    if (action) filter.action = action;
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    const skip = (page - 1) * limit;
    const total = await AuditLog.countDocuments(filter);
    const logs = await AuditLog.find(filter)
      .populate('performedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({ logs, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

export const getStats = async (req, res, next) => {
  try {
    const totalBooks = await Book.countDocuments();
    const totalMembers = await Member.countDocuments({ isActive: true });
    const activeLoans = await Loan.countDocuments({ status: 'active' });
    const overdueLoans = await Loan.countDocuments({
      status: 'active',
      dueDate: { $lt: new Date() },
    });

    res.json({ totalBooks, totalMembers, activeLoans, overdueLoans });
  } catch (err) {
    next(err);
  }
};