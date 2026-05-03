import Booking from '../models/Booking.js';
import Book from '../models/Book.js';
import Notification from '../models/Notification.js';
import { audit } from '../services/auditService.js';
import { sendReminderEmail } from '../services/mailService.js';

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

    const oldStatus = booking.status;
    booking.status = status;
    if (adminNote) booking.adminNote = adminNote;
    if (pickupDeadline) booking.pickupDeadline = new Date(pickupDeadline);
    if (status === 'picked_up') booking.pickedUpAt = new Date();
    await booking.save();

    // Зменшити кількість при схваленні
    if (status === 'approved' && oldStatus !== 'approved') {
      await Book.findByIdAndUpdate(booking.book._id, {
        $inc: { availableCopies: -1 }
      });
    }

    // Повернути кількість при відхиленні якщо було схвалено
    if (status === 'rejected' && oldStatus === 'approved') {
      await Book.findByIdAndUpdate(booking.book._id, {
        $inc: { availableCopies: 1 }
      });
    }

    const deadlineStr = pickupDeadline
      ? new Date(pickupDeadline).toLocaleDateString('uk-UA')
      : '';

    // Сповіщення авторизованому користувачу
    if (booking.member) {
      let notifText = '';
      let notifTitle = '';
      let notifType = 'booking_approved';

      if (status === 'approved') {
        notifTitle = 'Бронювання схвалено';
        notifText = `Ваше бронювання книги "${booking.book.title}" схвалено. Заберіть до ${deadlineStr}.`;
        notifType = 'booking_approved';
      } else if (status === 'rejected') {
        notifTitle = 'Бронювання відхилено';
        notifText = `Ваше бронювання книги "${booking.book.title}" відхилено. Причина: ${adminNote || 'не вказано'}`;
        notifType = 'booking_rejected';
      } else if (status === 'picked_up') {
        notifTitle = 'Книгу отримано';
        notifText = `Підтверджено отримання книги "${booking.book.title}". Дякуємо!`;
        notifType = 'booking_approved';
      }

      if (notifTitle) {
        await Notification.create({
          member: booking.member,
          title: notifTitle,
          text: notifText,
          type: notifType,
        });
      }
    } else {
      // Неавторизований — надіслати email
      try {
        if (status === 'approved') {
          await sendReminderEmail({
            to: booking.email,
            memberName: `${booking.firstName} ${booking.lastName}`,
            bookTitle: booking.book.title,
            dueDate: pickupDeadline,
            subject: 'Бронювання схвалено',
            message: `Ваше бронювання схвалено. Заберіть книгу до ${deadlineStr}.`,
          });
        } else if (status === 'rejected') {
          await sendReminderEmail({
            to: booking.email,
            memberName: `${booking.firstName} ${booking.lastName}`,
            bookTitle: booking.book.title,
            dueDate: null,
            subject: 'Бронювання відхилено',
            message: `На жаль, ваше бронювання відхилено. Причина: ${adminNote || 'не вказано'}`,
          });
        }
      } catch (mailErr) {
        console.error('Email помилка:', mailErr.message);
      }
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