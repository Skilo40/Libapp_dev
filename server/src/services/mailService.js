import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendReminderEmail = async ({ to, memberName, bookTitle, dueDate, subject, message }) => {
  const formattedDate = dueDate ? new Date(dueDate).toLocaleDateString('uk-UA') : '';
  const emailSubject = subject || `Нагадування: поверніть книгу "${bookTitle}"`;
  const emailMessage = message || `Нагадуємо, що книга "${bookTitle}" має бути повернена до ${formattedDate}.`;

  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject: emailSubject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7b1fa2;">LibraryApp</h2>
        <p>Шановний(а) <strong>${memberName}</strong>,</p>
        <p>${emailMessage}</p>
        <hr/>
        <p style="color: #9e9e9e; font-size: 12px;">
          Це автоматичне повідомлення від системи обліку бібліотеки.
        </p>
      </div>
    `,
  });
};

export const sendOverdueEmail = async ({ to, memberName, bookTitle, dueDate }) => {
  const formattedDate = new Date(dueDate).toLocaleDateString('uk-UA');

  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject: `Прострочення: книга "${bookTitle}" не повернена`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #c62828;">LibraryApp — Прострочення</h2>
        <p>Шановний(а) <strong>${memberName}</strong>,</p>
        <p>Термін повернення книги <strong>"${bookTitle}"</strong> минув <strong>${formattedDate}</strong>.</p>
        <p>Просимо якнайшвидше повернути книгу до бібліотеки.</p>
        <hr/>
        <p style="color: #9e9e9e; font-size: 12px;">
          Це автоматичне повідомлення від системи обліку бібліотеки.
        </p>
      </div>
    `,
  });
};

export const sendMessageReply = async ({ to, name, subject, replyText }) => {
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject: `Відповідь на ваше звернення: ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7b1fa2;">LibraryApp — Відповідь на звернення</h2>
        <p>Шановний(а) <strong>${name}</strong>,</p>
        <p>Ми відповіли на ваше звернення "<strong>${subject}</strong>":</p>
        <div style="background: #f3e5f5; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p>${replyText}</p>
        </div>
        <hr/>
        <p style="color: #9e9e9e; font-size: 12px;">
          Це автоматичне повідомлення від системи обліку бібліотеки.
        </p>
      </div>
    `,
  });
};

export const sendRegistrationConfirmation = async ({ to, firstName, lastName }) => {
  const name = `${firstName} ${lastName}`.trim();

  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject: 'Добро пожалувати до LibraryApp! Реєстрація завершена',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7b1fa2;">LibraryApp — Добро пожалувати!</h2>
        <p>Шановний(а) <strong>${name}</strong>,</p>
        <p>Дякуємо за реєстрацію на нашому сайті!</p>
        <p>Ваш акаунт успішно створений. Тепер ви можете:</p>
        <ul>
          <li>Переглядати каталог книг</li>
          <li>Бронювати книги</li>
          <li>Залишати відгуки</li>
          <li>Управляти своїми позиками та броніюваннями</li>
        </ul>
        <div style="text-align: center; margin: 24px 0;">
          <a href="${process.env.CLIENT_URL || 'http://localhost:80'}/login" 
             style="background: #7b1fa2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
            Увійти в акаунт
          </a>
        </div>
        <hr/>
        <p style="color: #9e9e9e; font-size: 12px;">
          Це автоматичне повідомлення від системи обліку бібліотеки LibraryApp.
          Будь ласка, не відповідайте на цей лист.
        </p>
      </div>
    `,
  });
};