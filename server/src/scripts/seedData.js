import 'dotenv/config';
import mongoose from 'mongoose';
import Book from '../models/Book.js';
import Member from '../models/Member.js';
import User from '../models/User.js';

await mongoose.connect(process.env.MONGODB_URI);
console.log('Підключено до MongoDB...');

const admin = await User.findOne({ email: 'admin@library.com' });
if (!admin) {
  console.log('Спочатку створіть адміна: npm run create-admin');
  process.exit(1);
}

const booksCount = await Book.countDocuments();
if (booksCount > 0) {
  console.log(`Книги вже є в базі (${booksCount} шт.). Пропускаємо.`);
} else {
  await Book.insertMany([
    {
      title: 'Кобзар',
      author: 'Тарас Шевченко',
      isbn: '978-966-03-0006-1',
      genre: 'Поезія',
      year: 1840,
      bookLanguage: 'Українська',
      pages: 320,
      description: 'Збірка поетичних творів Тараса Шевченка — символ української літератури.',
      totalCopies: 5,
      availableCopies: 5,
      addedBy: admin._id,
    },
    {
      title: 'Лісова пісня',
      author: 'Леся Українка',
      isbn: '978-966-03-0007-2',
      genre: 'Художня',
      year: 1911,
      bookLanguage: 'Українська',
      pages: 128,
      description: 'Драма-феєрія Лесі Українки — шедевр української драматургії.',
      totalCopies: 3,
      availableCopies: 3,
      addedBy: admin._id,
    },
    {
      title: 'Тіні забутих предків',
      author: 'Михайло Коцюбинський',
      isbn: '978-966-03-0008-3',
      genre: 'Художня',
      year: 1911,
      bookLanguage: 'Українська',
      pages: 96,
      description: 'Повість про гуцульське життя, кохання та народні вірування.',
      totalCopies: 4,
      availableCopies: 4,
      addedBy: admin._id,
    },
    {
      title: 'Місто',
      author: 'Валерян Підмогильний',
      isbn: '978-966-03-0009-4',
      genre: 'Художня',
      year: 1928,
      bookLanguage: 'Українська',
      pages: 288,
      description: 'Роман про молодого хлопця з села який приїжджає до великого міста.',
      totalCopies: 2,
      availableCopies: 2,
      addedBy: admin._id,
    },
    {
      title: '1984',
      author: 'Джордж Орвелл',
      isbn: '978-0-452-28423-4',
      genre: 'Фантастика',
      year: 1949,
      bookLanguage: 'Англійська',
      pages: 328,
      description: 'Антиутопічний роман про тоталітарне суспільство майбутнього.',
      totalCopies: 3,
      availableCopies: 3,
      addedBy: admin._id,
    },
    {
      title: 'Майстер і Маргарита',
      author: 'Михайло Булгаков',
      isbn: '978-966-03-0010-5',
      genre: 'Фантастика',
      year: 1967,
      bookLanguage: 'Українська',
      pages: 480,
      description: 'Роман про диявола який відвідує радянську Москву.',
      totalCopies: 4,
      availableCopies: 4,
      addedBy: admin._id,
    },
    {
      title: 'Маленький принц',
      author: 'Антуан де Сент-Екзюпері',
      isbn: '978-966-03-0011-6',
      genre: 'Дитяча',
      year: 1943,
      bookLanguage: 'Українська',
      pages: 96,
      description: 'Філософська казка про маленького принця з іншої планети.',
      totalCopies: 6,
      availableCopies: 6,
      addedBy: admin._id,
    },
    {
      title: 'Гаррі Поттер і філософський камінь',
      author: 'Дж. К. Роулінг',
      isbn: '978-966-917-218-3',
      genre: 'Фантастика',
      year: 1997,
      bookLanguage: 'Українська',
      pages: 320,
      description: 'Перша книга серії про юного чарівника Гаррі Поттера.',
      totalCopies: 5,
      availableCopies: 5,
      addedBy: admin._id,
    },
  ]);
  console.log('Книги додано успішно!');
}

const membersCount = await Member.countDocuments();
if (membersCount > 0) {
  console.log(`Читачі вже є в базі (${membersCount} шт.). Пропускаємо.`);
} else {
  await Member.insertMany([
    {
      firstName: 'Іван',
      lastName: 'Петренко',
      email: 'ivan@example.com',
      phone: '+380991234567',
      isActive: true,
    },
    {
      firstName: 'Марія',
      lastName: 'Коваленко',
      email: 'maria@example.com',
      phone: '+380991234568',
      isActive: true,
    },
    {
      firstName: 'Олег',
      lastName: 'Сидоренко',
      email: 'oleg@example.com',
      phone: '+380991234569',
      isActive: true,
    },
  ]);
  console.log('Читачів додано успішно!');
}

console.log('Дані успішно завантажено!');
await mongoose.disconnect();