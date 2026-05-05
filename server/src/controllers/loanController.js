import Loan from '../models/Loan.js';
import Book from '../models/Book.js';
import Notification from '../models/Notification.js';
import { audit } from '../services/auditService.js';

export const getLoans = async (req, res, next) => {
  try {
    const { status, memberId } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (memberId) filter.member = memberId;

    const loans = await Loan.find(filter)
      .populate('book', 'title author isbn')
      .populate('member', 'firstName lastName email')
      .populate('issuedBy', 'name')
      .sort({ createdAt: -1 });

    res.json({ loans, total: loans.length });
  } catch (err) {
    next(err);
  }
};

export const getLoan = async (req, res, next) => {
  try {
    const loan = await Loan.findById(req.params.id)
      .populate('book')
      .populate('member')
      .populate('issuedBy', 'name');
    if (!loan) return res.status(404).json({ message: 'Позику не знайдено' });
    res.json({ loan });
  } catch (err) {
    next(err);
  }
};

export const createLoan = async (req, res, next) => {
  try {
    const { bookId, memberId, dueDate, notes } = req.body;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Книгу не знайдено' });
    if (book.availableCopies < 1) {
      return res.status(400).json({ message: 'Немає доступних копій' });
    }

    const loan = await Loan.create({
      book: bookId,
      member: memberId,
      issuedBy: req.user._id,
      dueDate,
      notes,
    });

    book.availableCopies -= 1;
    await book.save();

    try {
      await Notification.create({
        member: memberId,
        title: 'Книгу видано',
        text: `Ви успішно отримали книгу "${book.title}". Будь ласка, поверніть її до ${new Date(dueDate).toLocaleDateString('uk-UA')}.`,
        type: 'loan_issued',
        isRead: false
      });
    } catch (notifErr) {
      console.error(notifErr);
    }

    await audit({
      action: 'LOAN_CREATED',
      entityType: 'loan',
      entityId: loan._id,
      performedBy: req.user._id,
      newValue: { bookId, memberId, dueDate },
      ip: req.ip,
    });

    res.status(201).json({ loan });
  } catch (err) {
    next(err);
  }
};

export const returnLoan = async (req, res, next) => {
  try {
    const loan = await Loan.findById(req.params.id);
    if (!loan) return res.status(404).json({ message: 'Позику не знайдено' });
    if (loan.status === 'returned') {
      return res.status(400).json({ message: 'Книга вже повернена' });
    }

    loan.returnDate = new Date();
    loan.status = 'returned';
    await loan.save();

    const book = await Book.findByIdAndUpdate(loan.book, { $inc: { availableCopies: 1 } });

    try {
      await Notification.create({
        member: loan.member,
        title: 'Книгу повернено',
        text: `Дякуємо! Книгу "${book ? book.title : 'Невідома книга'}" успішно повернено до бібліотеки.`,
        type: 'loan_returned',
        isRead: false
      });
    } catch (notifErr) {
      console.error(notifErr);
    }

    await audit({
      action: 'LOAN_RETURNED',
      entityType: 'loan',
      entityId: loan._id,
      performedBy: req.user._id,
      newValue: { returnDate: loan.returnDate },
      ip: req.ip,
    });

    res.json({ loan });
  } catch (err) {
    next(err);
  }
};