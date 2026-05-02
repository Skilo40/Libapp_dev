import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, trim: true },
  address: { type: String },
  dateOfBirth: { type: Date },
  membershipDate: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  avatarUrl: { type: String },
  password: { type: String },
}, { timestamps: true });

memberSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

export default mongoose.model('Member', memberSchema);