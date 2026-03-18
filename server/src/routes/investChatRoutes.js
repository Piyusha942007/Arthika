const express = require("express");
const router = express.Router();
const { handleSuggest, handleAsk } = require("../controllers/investChatController.js");

router.post("/suggest", handleSuggest);
router.post("/ask", handleAsk);

module.exports = router;
