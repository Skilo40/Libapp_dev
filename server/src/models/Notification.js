import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  title: { type: String, required: true },
  text: { type: String, required: true },
  type: {
    type: String,
    enum: ['booking_approved', 'booking_rejected', 'message_reply', 'overdue', 'reminder'],
    default: 'booking_approved',
  },
  isRead: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);