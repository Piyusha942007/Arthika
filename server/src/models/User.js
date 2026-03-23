import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  phone: String,
  role: String,
  level: { type: Number, default: 1 },
  progress: { type: Number, default: 0 },
  streaks: [String], // Array of date strings (YYYY-MM-DD)
  // New Persona & Finance fields
  persona: { type: String, default: 'Housewife' }, // 'Housewife' | 'Working'
  workType: { type: String, default: 'Entrepreneur' }, // 'Entrepreneur' | 'Employee'
  workNature: { type: String, default: '' },
  banks: [{ type: String }],
  loans: [{
    bank: String,
    amount: Number,
    interest: Number,
    duration: Number,
    startDate: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export default mongoose.model('User', userSchema);
