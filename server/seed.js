const mongoose = require('mongoose');
const User = require('./src/models/User'); // Path fixed for your structure
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://Arthika1:Arthika1234@cluster0.vxefxyc.mongodb.net/arthika?retryWrites=true&w=majority";

const seedData = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to Atlas for seeding...");
        
        // Clear existing data to avoid duplicates in the cloud
        await User.deleteMany({});

        const reshma = new User({
            name: "Reshma Singh",
            phone: "9960400000",
            email: "thereshma@gmail.com",
            role: "Housewife",
            level: 7,
            progress: 70, // This controls the yellow bar length
            streaks: [14, 15, 16, 17, 18, 19, 20] // Jan streak from Figma
        });

        await reshma.save();
        console.log("🌱 Database Seeded! Reshma's cloud profile is ready.");
        
        mongoose.connection.close();
    } catch (err) {
        console.error("❌ Seed error:", err);
        process.exit(1);
    }
};

seedData();