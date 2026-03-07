require("dotenv").config();
const mongoose = require("mongoose");
const SHG = require("./src/models/SHG");

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

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log("🟢 Connected to MongoDB. Seeding data...");

        // Clear existing to avoid duplicates if run multiple times
        await SHG.deleteMany({});
        console.log("🧹 Cleared existing SHGs.");

        // Insert new dummy data
        await SHG.insertMany(dummySHGs);
        console.log(`✅ Successfully seeded ${dummySHGs.length} SHGs into the database!`);

        mongoose.connection.close();
        process.exit(0);
    })
    .catch((error) => {
        console.error("❌ Error seeding database:", error);
        process.exit(1);
    });
