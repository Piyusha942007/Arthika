import express from "express";

import {
  createGoal,
  getGoals,
  addSavings,
  deleteGoal
} from "../controllers/goalController.js";

const router = express.Router();

router.post("/", createGoal);

router.get("/:clerkId", getGoals);

router.put("/add/:id", addSavings);

router.delete("/:id", deleteGoal);

export default router;