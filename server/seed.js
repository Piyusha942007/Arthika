require("dotenv").config();
const mongoose = require("mongoose");
const SHG = require("./src/models/SHG");
const User = require('./src/models/User');

const dummySHGs = [
    {
        name: "Mahila Shakti Mandal",
        location: "Pune",
        focusArea: "Handicrafts & Textiles",
        membersCount: 15,
        contactPhone: "9876543210"
    },
    {
        name: "Gramin Vikas Group",
        location: "Pune",
        focusArea: "Organic Farming",
        membersCount: 22,
        contactPhone: "9123456780"
    },
    {
        name: "Nari Udyam Sanstha",
        location: "Mumbai",
        focusArea: "Food Processing & Snacks",
        membersCount: 10,
        contactPhone: "9234567891"
    },
    {
        name: "Swayam Siddha Women",
        location: "Nagpur",
        focusArea: "Tailoring & Garments",
        membersCount: 18,
        contactPhone: "9345678912"
    },
    {
        name: "Krushi Kanya SHG",
        location: "Nashik",
        focusArea: "Dairy Products",
        membersCount: 25,
        contactPhone: "9456789123"
    },
    {
        name: "Jeevan Jyoti Mahila Bachat Gat",
        location: "Pune",
        focusArea: "Spices & Pickles",
        membersCount: 12,
        contactPhone: "9567891234"
    }
];

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb+srv://Arthika1:Arthika1234@cluster0.vxefxyc.mongodb.net/arthika?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log("🟢 Connected to MongoDB. Seeding data...");

        // Clear existing to avoid duplicates if run multiple times
        await SHG.deleteMany({});
        console.log("🧹 Cleared existing SHGs.");

        // Insert new dummy data
        await SHG.insertMany(dummySHGs);
        console.log(`✅ Successfully seeded ${dummySHGs.length} SHGs into the database!`);
        
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
        process.exit(0);
    })
    .catch((error) => {
        console.error("❌ Error seeding database:", error);
        process.exit(1);
    });
