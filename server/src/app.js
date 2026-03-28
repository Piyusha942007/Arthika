<<<<<<< Updated upstream
=======
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
import investChatRoutes from "./routes/investChatRoutes.js";

const app = express();


app.use(cors({
  origin: (origin, callback) => {
    const allowed = [process.env.FRONTEND_URL, "http://localhost:5173"].filter(Boolean);

    if (!origin || allowed.includes(origin) || allowed.includes(origin + "/")) {
      callback(null, true);
    } else {
      console.warn("CORS: BLOCKED ORIGIN:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
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
app.use("/api/investAI", investChatRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err);
  res.status(500).json({ 
    success: false, 
    message: err.message || "Internal Server Error"
  });
});



app.get("/", (req, res) => {
  res.send("Arthika API running 🚀");
});

// Start server when running directly (npm run dev)
const PORT = process.env.PORT || 5000;

// Only listen if this file is run directly (not imported by server.js)
const isDirectRun = process.argv[1] && (process.argv[1].endsWith('app.js') || process.argv[1].endsWith('src/app.js'));
if (isDirectRun) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
>>>>>>> Stashed changes
