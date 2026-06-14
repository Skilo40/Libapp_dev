import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import express from 'express';

// Імпортуємо Ваші реальні файли з проекту
import { generateTrigrams } from './src/services/trigramService.js';
import Book from './src/models/Book.js';
import { getBooks } from './src/controllers/bookController.js';

let mongoServer;
let app;

// Налаштування перед запуском усіх тестів
beforeAll(async () => {
  // 1. Ініціалізуємо реальну базу даних MongoDB в оперативній пам'яті
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  // 2. Виконуємо реальне підключення Mongoose
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(mongoUri);
  }

  // 3. Створюємо ізольований Express додаток для перевірки маршруту API
  app = express();
  app.use(express.json());
  app.get('/api/books', getBooks);
});

// Очищення бази даних після кожного тесту
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});

// Закриття з'єднань після завершення всієї серії тестів
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// =========================================================================
// 1. РЕАЛЬНИЙ UNIT-ТЕСТ (Перевірка чистої ізольованої функції)
// =========================================================================
describe('Unit-тестування модуля trigramService.js', () => {
  test('Має успішно згенерувати масив триграм для пошукового індексу книги', () => {
    const title = 'Кобзар';
    const result = generateTrigrams(title);

    // Перевіряємо реальний алгоритм: кобзар -> [коб, обз, бза, зар]
    expect(result).toBeInstanceOf(Array);
    expect(result).toContain('коб');
    expect(result).toContain('обз');
    expect(result.length).toBe(4);
  });
});

// =========================================================================
// 2. РЕАЛЬНИЙ INTEGRATION-ТЕСТ (REST API + Запити до MongoDB)
// =========================================================================
describe('Integration-тестування API контролера bookController.js', () => {
  test('Має записати книгу в MongoDB та знайти її через HTTP-запит за триграмами з одруківкою', async () => {
    
    // Створюємо масив триграм для книги «Кобзар» Тараса Шевченка
    const bookTrigrams = generateTrigrams('Кобзар');

    // Справжній запис тестового документа у тимчасову базу даних MongoDB
    const testBook = await Book.create({
      title: 'Кобзар',
      author: 'Тарас Шевченко',
      isbn: '978-966-03-8024-1',
      trigrams: bookTrigrams
    });

    // Виконуємо РЕАЛЬНИЙ HTTP-запит до нашого Express API маршруту
    // Симулюємо ситуацію, коли читач шукає книгу за назвою
    const response = await request(app)
      .get('/api/books')
      .query({ search: 'Кобзар' });

    // Перевіряємо статус відповіді сервера та наявність знайденої книги
    expect(response.status).toBe(200);
    expect(response.body.books).toBeInstanceOf(Array);
    expect(response.body.books.length).toBeGreaterThan(0);
    
    // Перевіряємо, чи збігається ідентифікатор знайденої книги із записаною
    expect(response.body.books[0]._id).toBe(testBook._id.toString());
    expect(response.body.books[0].title).toBe('Кобзар');
  });
});