import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import goalRoutes from "./routes/goalRoutes.js";
import lessonRoutes from "./routes/lessonRoutes.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

connectDB();

app.use("/api/goals", goalRoutes);
app.use("/api/lessons", lessonRoutes);

app.get("/", (req, res) => {
  res.send("Arthika API running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});