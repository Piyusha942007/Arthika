import Goal from "../models/Goal.js";


// CREATE GOAL
export const createGoal = async (req, res) => {

  try {

    const { clerkId, title, targetAmount } = req.body;

    const goal = new Goal({
      clerkId,
      title,
      targetAmount,
      savedAmount: 0
    });

    const savedGoal = await goal.save();

    res.status(201).json(savedGoal);

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "Error creating goal" });

  }

};



// GET USER GOALS
export const getGoals = async (req, res) => {

  try {

    const { clerkId } = req.params;

    const goals = await Goal.find({ clerkId });

    res.json(goals);

  } catch (error) {

    res.status(500).json({ message: "Error fetching goals" });

  }

};



// ADD SAVINGS
export const addSavings = async (req, res) => {

  try {

    const { amount } = req.body;

    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    goal.savedAmount += Number(amount);

    await goal.save();

    res.json(goal);

  } catch (error) {

    res.status(500).json({ message: "Error updating savings" });

  }

};



// DELETE GOAL
export const deleteGoal = async (req, res) => {

  try {

    await Goal.findByIdAndDelete(req.params.id);

    res.json({ message: "Goal deleted" });

  } catch (error) {

    res.status(500).json({ message: "Error deleting goal" });

  }

};