import Booking from '../models/Booking.js';
import Book from '../models/Book.js';
import Notification from '../models/Notification.js';
import { audit } from '../services/auditService.js';

export const createBooking = async (req, res, next) => {
  try {
    const { bookId, firstName, lastName, email, phone, notes, memberId } = req.body;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Книгу не знайдено' });
    if (book.availableCopies < 1) {
      return res.status(400).json({ message: 'Немає доступних примірників' });
    }

    const booking = await Booking.create({
      book: bookId,
      member: memberId || null,
      firstName, lastName, email, phone, notes,
    });

    res.status(201).json({ booking });
  } catch (err) {
    next(err);
  }
};

export const getBookings = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const bookings = await Booking.find(filter)
      .populate('book', 'title author isbn')
      .populate('member', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json({ bookings, total: bookings.length });
  } catch (err) {
    next(err);
  }
};

export const updateBooking = async (req, res, next) => {
  try {
    const { status, adminNote, pickupDeadline } = req.body;
    const booking = await Booking.findById(req.params.id).populate('book', 'title');
    if (!booking) return res.status(404).json({ message: 'Бронювання не знайдено' });

    booking.status = status;
    if (adminNote) booking.adminNote = adminNote;
    if (pickupDeadline) booking.pickupDeadline = pickupDeadline;
    await booking.save();

    if (booking.member) {
      const notifText = status === 'approved'
        ? `Ваше бронювання книги "${booking.book.title}" схвалено. Заберіть до ${new Date(pickupDeadline).toLocaleDateString('uk-UA')}.`
        : `Ваше бронювання книги "${booking.book.title}" відхилено. Причина: ${adminNote || 'не вказано'}`;

      await Notification.create({
        member: booking.member,
        title: status === 'approved' ? 'Бронювання схвалено' : 'Бронювання відхилено',
        text: notifText,
        type: status === 'approved' ? 'booking_approved' : 'booking_rejected',
      });
    }

    await audit({
      action: 'LOAN_UPDATED',
      entityType: 'loan',
      entityId: booking._id,
      performedBy: req.user._id,
      newValue: { status, adminNote },
      ip: req.ip,
    });

    res.json({ booking });
  } catch (err) {
    next(err);
  }
};

export const getMemberBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ member: req.params.memberId })
      .populate('book', 'title author coverUrl')
      .sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (err) {
    next(err);
  }
};