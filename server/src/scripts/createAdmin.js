import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';

await mongoose.connect(process.env.MONGODB_URI);

const existing = await User.findOne({ email: 'admin@library.com' });
if (existing) {
  console.log('Адмін вже існує');
} else {
  await User.create({
    name: 'Admin',
    email: 'admin@library.com',
    password: 'password123',
    role: 'admin',
  });
  console.log('Адміна створено успішно');
}

await mongoose.disconnect();