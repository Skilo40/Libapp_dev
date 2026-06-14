import 'dotenv/config'; // Завантажуємо змінні з .env
import { sendRegistrationConfirmation } from './src/services/mailService.js';

const runTest = async () => {
  console.log('⏳ Починаємо тест відправки листа...');
  console.log(`📧 Пошта відправника (SMTP_USER): ${process.env.SMTP_USER}`);
  
  try {
    await sendRegistrationConfirmation({
      to: 'teteravlad72@gmail.com', 
      firstName: 'Тест',
      lastName: 'Тестовий'
    });
    
    console.log('✅ Успіх! Лист було відправлено. Перевірте вашу скриньку (і папку Спам).');
    process.exit(0);
  } catch (error) {
    console.error('❌ Помилка при відправці листа:');
    console.error(error.message);
    if (error.response) {
      console.error('Відповідь сервера:', error.response);
    }
    process.exit(1);
  }
};

runTest();