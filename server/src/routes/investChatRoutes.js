import express from "express";
const router = express.Router();
import { getSuggestions, askArthika } from "../controllers/investChatController.js";

router.post("/suggest", getSuggestions);
router.post("/ask", askArthika);

export default router;