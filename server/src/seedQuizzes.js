const mongoose = require('mongoose');
const Quiz = require('./models/Quiz');
require('dotenv').config();

// Require our generated massive data files
const level1_to_4 = require('./data/level1_to_4');
const level5_to_7 = require('./data/level5_to_7');
const level8_to_10 = require('./data/level8_to_10');

// Combine all the quiz data
const allQuizzes = [...level1_to_4, ...level5_to_7, ...level8_to_10];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        // Clear existing quizzes to prevent duplicates during testing
        await Quiz.deleteMany({});
        console.log("Cleared old quizzes");

        await Quiz.insertMany(allQuizzes);
        console.log(`Successfully seeded ${allQuizzes.length} unique Quiz stages into the database!`);
        console.log("Your entire 10-Level progression map is now fully populated in English and Hindi.");

        process.exit(0);
    } catch (error) {
        console.error("Error seeding quizzes:", error);
        process.exit(1);
    }
}

seed();
