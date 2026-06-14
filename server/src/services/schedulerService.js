import cron from 'node-cron';
import Loan from '../models/Loan.js';
import Booking from '../models/Booking.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { sendReminderEmail, sendOverdueEmail } from './mailService.js';

const checkLoans = async () => {
  console.log('[Scheduler] Перевірка термінів позик...');

  const now = new Date();
  const daysBefore = Number(process.env.NOTIFY_DAYS_BEFORE) || 3;
  const soon = new Date();
  soon.setDate(soon.getDate() + daysBefore);

  try {
    const upcomingLoans = await Loan.find({
      status: 'active',
      dueDate: { $gte: now, $lte: soon },
      notificationSentAt: null,
    }).populate('book', 'title').populate('member', 'firstName lastName email');

    for (const loan of upcomingLoans) {
      try {
        await sendReminderEmail({
          to: loan.member.email,
          memberName: `${loan.member.firstName} ${loan.member.lastName}`,
          bookTitle: loan.book.title,
          dueDate: loan.dueDate,
        });

        await Notification.create({
          member: loan.member._id,
          title: 'Скоро повертати книгу',
          text: `Нагадуємо, що термін повернення книги "${loan.book.title}" спливає ${new Date(loan.dueDate).toLocaleDateString('uk-UA')}.`,
          type: 'loan_reminder',
          isRead: false
        });

        loan.notificationSentAt = new Date();
        await loan.save();
        console.log(`[Scheduler] Нагадування надіслано: ${loan.member.email}`);
      } catch (err) {
        console.error(`[Scheduler] Помилка надсилання до ${loan.member.email}:`, err.message);
      }
    }

    const overdueLoans = await Loan.find({
      status: 'active',
      dueDate: { $lt: now },
      overdueNotified: false,
    }).populate('book', 'title').populate('member', 'firstName lastName email');

    for (const loan of overdueLoans) {
      try {
        loan.status = 'overdue';
        loan.overdueNotified = true;
        await loan.save();

        await sendOverdueEmail({
          to: loan.member.email,
          memberName: `${loan.member.firstName} ${loan.member.lastName}`,
          bookTitle: loan.book.title,
          dueDate: loan.dueDate,
        });

        await Notification.create({
          member: loan.member._id,
          title: 'Прострочення!',
          text: `Термін повернення книги "${loan.book.title}" минув. Будь ласка, поверніть її якнайшвидше.`,
          type: 'loan_overdue',
          isRead: false
        });

        console.log(`[Scheduler] Сповіщення про прострочення: ${loan.member.email}`);
      } catch (err) {
        console.error(`[Scheduler] Помилка надсилання до ${loan.member.email}:`, err.message);
      }
    }

    console.log(`[Scheduler] Готово. Нагадувань: ${upcomingLoans.length}, Прострочень: ${overdueLoans.length}`);
  } catch (err) {
    console.error('[Scheduler] Помилка перевірки:', err.message);
  }
};

const checkExpiredBookings = async () => {
  console.log('[Scheduler] Перевірка простроченого отримання бронювань...');

  const now = new Date();
  const expirationDays = 3;
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() - expirationDays);

  try {
    // Знайти бронювання, у яких дата отримання минула на 3 дні
    const expiredBookings = await Booking.find({
      status: 'approved',
      pickupDeadline: { $lt: expirationDate },
      bookingExpiredNotified: { $ne: true },
    }).populate('book', 'title').populate('member', 'firstName lastName email');

    for (const booking of expiredBookings) {
      try {
        // Скасувати бронювання
        booking.status = 'cancelled';
        booking.bookingExpiredNotified = true;
        await booking.save();

        // Повернути примірник
        await Loan.findByIdAndDelete(booking._id);
        // Порахувати доступні примірники
        const availableCopies = await Booking.countDocuments({
          book: booking.book._id,
          status: 'approved'
        });

        // Сповіщення користувачу
        if (booking.member) {
          await Notification.create({
            member: booking.member._id,
            title: 'Бронювання скасовано',
            text: `На жаль, ваше бронювання на книгу "${booking.book.title}" скасовано, оскільки ви не забрали її протягом визначеного терміну (${new Date(booking.pickupDeadline).toLocaleDateString('uk-UA')}).`,
            type: 'booking_cancelled',
            isRead: false
          });
        }

        // Сповіщення адміну
        const admins = await User.find({ role: 'admin' });
        for (const admin of admins) {
          await Notification.create({
            user: admin._id,
            title: 'Бронювання автоматично скасовано',
            text: `Бронювання на книгу "${booking.book.title}" для ${booking.firstName} ${booking.lastName} скасовано через простроченість.`,
            type: 'booking_auto_cancelled',
            isRead: false
          });
        }

        console.log(`[Scheduler] Бронювання скасовано: ${booking._id}`);
      } catch (err) {
        console.error(`[Scheduler] Помилка при скасуванні бронювання ${booking._id}:`, err.message);
      }
    }

    console.log(`[Scheduler] Готово. Скасовано бронювань: ${expiredBookings.length}`);
  } catch (err) {
    console.error('[Scheduler] Помилка перевірки бронювань:', err.message);
  }
};

export const startScheduler = () => {
  cron.schedule('0 8 * * *', checkLoans, {
    timezone: 'Europe/Kiev',
  });
  cron.schedule('0 9 * * *', checkExpiredBookings, {
    timezone: 'Europe/Kiev',
  });
  console.log('[Scheduler] Запущено — перевірка позик щодня о 08:00 та бронювань о 09:00');
};