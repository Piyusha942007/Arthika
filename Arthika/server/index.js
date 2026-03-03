const express = require('express');
const cors = require('cors'); 
const mongoose = require('mongoose');

const app = express();
app.use(cors()); 
app.use(express.json());

const atlasURI = "mongodb+srv://Arthika1:Arthika1234@cluster0.vxefxyc.mongodb.net/arthika?retryWrites=true&w=majority";
mongoose.connect(atlasURI)
  .then(() => console.log("☁️  CONNECTED TO MONGODB ATLAS!"))
  .catch(err => console.error("❌ ATLAS CONNECTION ERROR:", err.message));

// Updated Schema to include userId
const goalSchema = new mongoose.Schema({
  title: String,
  percentage: { type: Number, default: 0 },
  userId: String, // Tracks the unique user from Clerk
  colorClass: String,
  progressBg: String,
  progressFill: String
});

const Goal = mongoose.model('Goal', goalSchema);

// GET: Fetch ONLY the logged-in user's goals
app.get('/api/invest/goals', async (req, res) => {
    const { userId } = req.query; 
    try {
        let goals = await Goal.find({ userId }); 
        
        // If this specific user has no goals yet, create them at 0%
        if (goals.length === 0) {
            const starters = [
                { title: "College Fund", percentage: 0, userId, colorClass: "pink-card", progressBg: "#DD6890", progressFill: "#FFCC4D" },
                { title: "Business", percentage: 0, userId, colorClass: "yellow-card", progressBg: "#FEFEFE", progressFill: "#DF769A" },
                { title: "Groceries", percentage: 0, userId, colorClass: "white-card", progressBg: "#DF769A", progressFill: "#FED05E" }
            ];
            await Goal.insertMany(starters);
            goals = await Goal.find({ userId });
        }
        res.json(goals); 
    } catch (err) {
        res.status(500).json({ error: "DB Error" });
    }
});

// POST: Save money for a SPECIFIC user's goal
app.post('/api/invest/save', async (req, res) => {
    try {
        const { title, userId } = req.body;
        // Only update the goal belonging to this user
        let goal = await Goal.findOne({ title, userId });
        if (goal) {
            goal.percentage = Math.min(goal.percentage + 10, 100);
            await goal.save();
            res.json(goal);
        } else {
            res.status(404).json({ message: "Goal not found for this user" });
        }
    } catch (err) {
        res.status(500).json({ error: "Save failed" });
    }
});

app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));