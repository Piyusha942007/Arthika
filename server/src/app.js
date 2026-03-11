import express from "express";
import cors from "cors";
import "dotenv/config"; // Ensures .env is loaded BEFORE other imports

import connectDB from "./config/db.js";
import goalRoutes from "./routes/goalRoutes.js";
import lessonRoutes from "./routes/lessonRoutes.js";
import shgRoutes from "./routes/shgRoutes.js";
import businessRoutes from "./routes/businessRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

connectDB();

app.use("/api/goals", goalRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/shgs", shgRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/profile", profileRoutes);

app.get("/", (req, res) => {
  res.send("Arthika API running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});