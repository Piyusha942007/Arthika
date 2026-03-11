import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  phone: String,
  role: String,
  level: { type: Number, default: 1 },
  progress: { type: Number, default: 0 },
  streaks: [Number] // Array of days
}, { timestamps: true });

export default mongoose.model('User', userSchema);
