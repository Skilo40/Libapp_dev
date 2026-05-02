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

export const sendReminderEmail = async ({ to, memberName, bookTitle, dueDate }) => {
  const formattedDate = new Date(dueDate).toLocaleDateString('uk-UA');

  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject: `Нагадування: поверніть книгу "${bookTitle}"`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">Нагадування від бібліотеки</h2>
        <p>Шановний(а) <strong>${memberName}</strong>,</p>
        <p>Нагадуємо, що книга <strong>"${bookTitle}"</strong> має бути повернена до <strong>${formattedDate}</strong>.</p>
        <p>Будь ласка, поверніть книгу вчасно, щоб уникнути штрафних санкцій.</p>
        <hr/>
        <p style="color: #7f8c8d; font-size: 12px;">Це автоматичне повідомлення від системи обліку бібліотеки.</p>
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
        <h2 style="color: #e74c3c;">Прострочення повернення книги</h2>
        <p>Шановний(а) <strong>${memberName}</strong>,</p>
        <p>Термін повернення книги <strong>"${bookTitle}"</strong> минув <strong>${formattedDate}</strong>.</p>
        <p>Просимо якнайшвидше повернути книгу до бібліотеки.</p>
        <hr/>
        <p style="color: #7f8c8d; font-size: 12px;">Це автоматичне повідомлення від системи обліку бібліотеки.</p>
      </div>
    `,
  });
};