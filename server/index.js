const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./src/models/User'); 
require('dotenv').config();

const app = express();

// 1. CORS Configuration - Allows your React app to talk to this server
app.use(cors({
    origin: "http://localhost:5173", 
    methods: ["GET", "POST", "PUT"],
    credentials: true
}));

app.use(express.json());

// 2. Database Connection with Fallback
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://Arthika1:Arthika1234@cluster0.vxefxyc.mongodb.net/arthika?retryWrites=true&w=majority"; 

mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB Atlas Connected Successfully"))
    .catch(err => {
        console.log("❌ MongoDB Connection Error Details:");
        console.error(err);
    });

// 3. API ROUTES

// GET: Fetch profile by email
// Route to get profile data (Automated Creation)
app.get('/api/profile/:email', async (req, res) => {
    try {
        let user = await User.findOne({ email: req.params.email });

        // If user doesn't exist in MongoDB, create a new one automatically
        if (!user) {
            console.log("Creating new profile for:", req.params.email);
            user = new User({
                name: req.params.email.split('@')[0], // Temporary name from email
                email: req.params.email,
                phone: "Add Phone",
                role: "Housewife",
                level: 1,
                progress: 10,
                streaks: []
            });
            await user.save();
        }
        
        res.json(user);
    } catch (err) {
        console.error("Server Error:", err);
        res.status(500).json(err);
    }
});

// PUT: Update Role
app.put('/api/profile/update-role', async (req, res) => {
    const { email, role } = req.body;
    try {
        const updatedUser = await User.findOneAndUpdate(
            { email }, 
            { role }, 
            { new: true }
        );
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json(err);
    }
});

// POST: Toggle Calendar Streak
app.post('/api/profile/toggle-streak', async (req, res) => {
    const { email, date } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).send("User not found");

        const dateIndex = user.streaks.indexOf(date);
        if (dateIndex > -1) {
            user.streaks.splice(dateIndex, 1); // Remove if exists
        } else {
            user.streaks.push(date); // Add if not exists
            user.streaks.sort((a, b) => a - b);
        }

        await user.save();
        res.json(user);
    } catch (err) {
        res.status(500).json(err);
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));