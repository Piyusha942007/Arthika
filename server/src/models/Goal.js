import mongoose from "mongoose";

const goalSchema = new mongoose.Schema({

  clerkId: {
    type: String,
    required: true
  },

  title: {
    type: String,
    required: true
  },

  targetAmount: {
    type: Number,
    required: true
  },

  savedAmount: {
    type: Number,
    default: 0
  }

}, { timestamps: true });

const Goal = mongoose.model("Goal", goalSchema);

export default Goal;