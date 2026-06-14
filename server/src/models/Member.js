import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const memberSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, trim: true },
  address: { type: String },
  dateOfBirth: { type: Date },
  membershipDate: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  avatar: { type: String }, // base64 data URL
  password: { type: String },
  role: { type: String, enum: ['member'], default: 'member' },
}, { timestamps: true });

memberSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return;
  const salt = await bcryptjs.genSalt(12);
  this.password = await bcryptjs.hash(this.password, salt);
});

memberSchema.methods.comparePassword = async function (candidate) {
  return bcryptjs.compare(candidate, this.password);
};

memberSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model('Member', memberSchema);