import Notification from '../models/Notification.js';

export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ member: req.params.memberId })
      .sort({ createdAt: -1 });
    const unread = notifications.filter(n => !n.isRead).length;
    res.json({ notifications, unread });
  } catch (err) {
    next(err);
  }
};

export const markRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { member: req.params.memberId },
      { isRead: true }
    );
    res.json({ message: 'Позначено як прочитані' });
  } catch (err) {
    next(err);
  }
};