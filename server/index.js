require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const chatRoutes = require("./src/routes/chatRoutes");
const shgRoutes = require("./src/routes/shgRoutes");
const businessRoutes = require("./src/routes/businessRoutes");

const app = express();
app.use(cors());
app.use(express.json());
// Allow frontend to GET uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/api/chat", chatRoutes);
app.use("/api/shgs", shgRoutes);
app.use("/api/business", businessRoutes);

const PORT = process.env.PORT || 8000;

// Connect to MongoDB if URI is provided, but don't crash if it's missing (allows Gemini chat to stay up)
if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log("Connected to MongoDB successfully!"))
        .catch(err => console.error("MongoDB connection error:", err));
} else {
    console.warn("⚠️ MONGODB_URI not found in .env. Community Page DB features will disabled.");
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
