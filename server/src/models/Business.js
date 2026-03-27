import mongoose from 'mongoose';

const BusinessSchema = new mongoose.Schema({
  businessName: { type: String, required: true }, // Store as CamelCase
  ownerName: String,
  clerkId: String, // To identify who can delete the post
  contact: { type: String, required: true }, // Format: +91 XXXXXXXXXX
  location: String,
  category: { 
    type: String, 
    enum: ['Health', 'Education', 'Food', 'Handicrafts', 'Finance', 'Other'] 
  },
  description: String,
  imageUrls: [String], // Array of Cloudinary URLs
  comments: [{
    clerkId: String, // Authenticate comment ownership
    userName: String,
    userImage: String,
    text: String,
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export default mongoose.model('Business', BusinessSchema);
