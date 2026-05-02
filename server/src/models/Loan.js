import mongoose from 'mongoose';

const loanSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  issueDate: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
  returnDate: { type: Date, default: null },
  status: {
    type: String,
    enum: ['active', 'returned', 'overdue'],
    default: 'active',
  },
  notificationSentAt: { type: Date, default: null },
  overdueNotified: { type: Boolean, default: false },
  notes: { type: String },
}, { timestamps: true });

export default mongoose.model('Loan', loanSchema);