const express = require('express');
const router = express.Router();
const Investment = require('../models/Investment');

// 1. GET all investment goals (to display on the page)
router.get('/goals', async (req, res) => {
  try {
    const goals = await Investment.find();
    res.json(goals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. POST a new investment goal (to save from the page)
router.post('/save', async (req, res) => {
  const goal = new Investment({
    title: req.body.title,
    percentage: req.body.percentage,
    colorClass: req.body.colorClass,
    progressBg: req.body.progressBg,
    progressFill: req.body.progressFill,
    userId: req.body.userId || "guest_user" // Temporary placeholder
  });

  try {
    const newGoal = await goal.save();
    res.status(201).json(newGoal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;