import 'dotenv/config';
import mongoose from 'mongoose';
import Book from '../models/Book.js';
import Member from '../models/Member.js';
import User from '../models/User.js';
import Review from '../models/Review.js';
import Booking from '../models/Booking.js';
import Loan from '../models/Loan.js';
import Message from '../models/Message.js';
import Notification from '../models/Notification.js';
import AuditLog from '../models/AuditLog.js';

await mongoose.connect(process.env.MONGODB_URI);
console.log('Підключено до MongoDB...');

try {
  // Видаляємо всі колекції крім User (адміна зберігаємо)
  console.log('Видаляються колекції...');
  
  await Book.deleteMany({});
  console.log('✓ Книги видалено');
  
  await Review.deleteMany({});
  console.log('✓ Рецензії видалено');
  
  await Booking.deleteMany({});
  console.log('✓ Бронювання видалено');
  
  await Loan.deleteMany({});
  console.log('✓ Позичання видалено');
  
  await Message.deleteMany({});
  console.log('✓ Повідомлення видалено');
  
  await Notification.deleteMany({});
  console.log('✓ Сповіщення видалено');
  
  await AuditLog.deleteMany({});
  console.log('✓ Логи аудиту видалено');
  
  await Member.deleteMany({});
  console.log('✓ Читачі видалено');

  console.log('\n✅ БД повністю очищена! Тепер запусти: npm run seed');
} catch (err) {
  console.error('Помилка:', err);
  process.exit(1);
}

await mongoose.disconnect();
