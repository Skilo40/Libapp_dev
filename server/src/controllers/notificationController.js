import Notification from '../models/Notification.js';

export const getNotifications = async (req, res) => {
  try {
    const { memberId } = req.params;
    const notifications = await Notification.find({ member: memberId }).sort({ createdAt: -1 });
    const unread = notifications.filter(n => !n.isRead).length;
    
    res.status(200).json({ notifications, unread });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { memberId } = req.params;
    
    await Notification.updateMany(
      { member: memberId, isRead: false },
      { $set: { isRead: true } }
    );
    
    res.status(200).json({ message: 'Success' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    
    await Notification.findByIdAndDelete(id);
    
    res.status(200).json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};