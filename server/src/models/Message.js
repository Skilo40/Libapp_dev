import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  text: { type: String, required: true },
  member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  status: { type: String, enum: ['new', 'replied'], default: 'new' },
  replyText: { type: String },
  repliedAt: { type: Date },
}, { timestamps: true });

export default mongoose.model('Message', messageSchema);