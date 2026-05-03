import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import { startScheduler } from './services/schedulerService.js';
import Book from './models/Book.js';

import authRoutes from './routes/auth.js';
import bookRoutes from './routes/books.js';
import memberRoutes from './routes/members.js';
import loanRoutes from './routes/loans.js';
import adminRoutes from './routes/admin.js';
import catalogRoutes from './routes/catalog.js';
import bookingRoutes from './routes/bookings.js';
import notificationRoutes from './routes/notifications.js';
import messageRoutes from './routes/messages.js';
import profileRoutes from './routes/profile.js';

// Мап мов для міграції
const LANGUAGE_MAP = {
  'Українська': 'uk',
  'Англійська': 'en',
  'Польська': 'pl',
  'Німецька': 'de',
  'Францу': 'fr',
  'Інша': 'other',
};

// Функція для міграції старих мов
async function migrateLanguages() {
  try {
    for (const [oldLang, newCode] of Object.entries(LANGUAGE_MAP)) {
      const count = await Book.countDocuments({ language: oldLang });
      if (count > 0) {
        await Book.updateMany({ language: oldLang }, { language: newCode });
        console.log(`[Migration] Updated ${count} books: ${oldLang} → ${newCode}`);
      }
    }
  } catch (err) {
    console.error('[Migration Error]', err.message);
  }
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/catalog', catalogRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/profile', profileRoutes);

app.use(errorHandler);

connectDB().then(async () => {
  // Запускаємо міграцію мов
  await migrateLanguages();
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    startScheduler();
  });
});

export default app;