import Message from '../models/Message.js';
import Notification from '../models/Notification.js';
import Member from '../models/Member.js';
import { sendMessageReply } from '../services/mailService.js';

export const createMessage = async (req, res, next) => {
  try {
    const { name, email, subject, text, memberId } = req.body;
    
    let finalMemberId = memberId;
    
    if (!finalMemberId && email) {
      const existingMember = await Member.findOne({ email });
      if (existingMember) {
        finalMemberId = existingMember._id;
      }
    }

    const message = await Message.create({
      name, email, subject, text,
      member: finalMemberId || null,
    });
    res.status(201).json({ message });
  } catch (err) {
    next(err);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const messages = await Message.find(filter)
      .populate('member', 'firstName lastName')
      .sort({ createdAt: -1 });
    res.json({ messages, total: messages.length });
  } catch (err) {
    next(err);
  }
};

export const replyMessage = async (req, res, next) => {
  try {
    const { replyText } = req.body;
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ message: 'Повідомлення не знайдено' });

    message.replyText = replyText;
    message.status = 'replied';
    message.repliedAt = new Date();
    await message.save();

    if (message.member) {
      try {
        await Notification.create({
          member: message.member,
          title: 'Відповідь на ваше звернення',
          text: replyText,
          type: 'admin_reply',
          isRead: false
        });
      } catch (notifErr) {
        console.error(notifErr);
      }
    } else {
      try {
        await sendMessageReply({
          to: message.email,
          name: message.name,
          subject: message.subject,
          replyText,
        });
      } catch (mailErr) {
        console.error(mailErr.message);
      }
    }

    res.json({ message });
  } catch (err) {
    next(err);
  }
};