import axios from 'axios';

const INVEST_AI_URL = 'http://localhost:5000/api/investAI';

export const getSuggestions = async (persona, businessInfo) => {
  try {
    const res = await axios.post(`${INVEST_AI_URL}/suggest`, { persona, businessInfo });
    return res.data.reply || "💡 Keep track of daily expenses to save more effectively! It's okay to start small.";
  } catch (err) {
    console.error("Backend Gemini Error (Suggest):", err);
    return "💡 Tip 1: Keep track of daily expenses to save more effectively! It's okay to start small.\n💡 Tip 2: Consistency is key.";
  }
};

export const askArthika = async (persona, question, language = "en-IN", businessInfo) => {
  try {
    const res = await axios.post(`${INVEST_AI_URL}/ask`, { persona, question, language, businessInfo });
    return res.data.reply || "I'm having trouble connecting right now, but remember that saving even a little bit today is a win!";
  } catch (err) {
    console.error("Backend Gemini Chat Error:", err);
    return "I'm experiencing intermittent connection issues. Please try again soon!";
  }
};
