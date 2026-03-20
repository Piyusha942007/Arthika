require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const chatRoutes = require("./src/routes/chatRoutes");
const investChatRoutes = require("./src/routes/investChatRoutes");
const shgRoutes = require("./src/routes/shgRoutes");
const businessRoutes = require("./src/routes/businessRoutes");
const User = require('./src/models/User');

const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT"],
    credentials: true
}));
app.use(express.json());
// Allow frontend to GET uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/api/chat", chatRoutes);
app.use("/api/investAI", investChatRoutes);
app.use("/api/shgs", shgRoutes);
app.use("/api/business", businessRoutes);

// Profile routes
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
                streaks: [],
                persona: "Housewife",
                workType: "Entrepreneur",
                workNature: ""
            });
            await user.save();
        }

        res.json(user);
    } catch (err) {
        console.error("Server Error:", err);
        res.status(500).json(err);
    }
});

// New Persona & Finance API
app.get('/api/user/profile/:email', async (req, res) => {
    try {
        let user = await User.findOne({ email: req.params.email });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json(err);
    }
});

app.put('/api/user/profile', async (req, res) => {
    const { email, persona, workType, workNature, banks, loans } = req.body;
    try {
        const updatedUser = await User.findOneAndUpdate(
            { email },
            { $set: { persona, workType, workNature, banks, loans } },
            { new: true, runValidators: true }
        );
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json(err);
    }
});

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

// Connect to MongoDB if URI is provided, but don't crash if it's missing (allows Gemini chat to stay up)
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb+srv://Arthika1:Arthika1234@cluster0.vxefxyc.mongodb.net/arthika?retryWrites=true&w=majority";

if (MONGO_URI) {
    mongoose.connect(MONGO_URI)
        .then(() => console.log("Connected to MongoDB successfully!"))
        .catch(err => console.error("MongoDB connection error:", err));
} else {
    console.warn("⚠️ MONGODB_URI not found in .env. Community Page DB features will disabled.");
}
// This will log every request that fails to find a route
app.use((req, res) => {
    console.log(`404 attempted on: ${req.method} ${req.url}`);
    res.status(404).send("Route not found on server");
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
