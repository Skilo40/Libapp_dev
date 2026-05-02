import cron from 'node-cron';
import Loan from '../models/Loan.js';
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

export const startScheduler = () => {
  cron.schedule('0 8 * * *', checkLoans, {
    timezone: 'Europe/Kiev',
  });
  console.log('[Scheduler] Запущено — перевірка щодня о 08:00');
};