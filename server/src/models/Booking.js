import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending',
  },
  pickupDeadline: { type: Date },
  notes: { type: String },
  adminNote: { type: String },
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);