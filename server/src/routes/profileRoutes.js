import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.get('/:email', async (req, res) => {
    try {
        let user = await User.findOne({ email: req.params.email });
        if (!user) {
            console.log("Creating new profile for:", req.params.email);
            user = new User({
                name: req.params.email.split('@')[0],
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

router.put('/update-role', async (req, res) => {
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

router.put('/update-work', async (req, res) => {
    const { email, workNature } = req.body;
    try {
        const updatedUser = await User.findOneAndUpdate(
            { email }, 
            { workNature }, 
            { new: true }
        );
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post('/toggle-streak', async (req, res) => {
    const { email, date } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).send("User not found");

        const dateIndex = user.streaks.indexOf(date);
        if (dateIndex > -1) {
            user.streaks.splice(dateIndex, 1);
        } else {
            user.streaks.push(date);
            user.streaks.sort((a, b) => a - b);
        }

        await user.save();
        res.json(user);
    } catch (err) {
        res.status(500).json(err);
    }
});

export default router;
