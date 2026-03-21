import axios from 'axios';

const INVEST_AI_URL = 'http://localhost:5000/api/investAI';

export const getSuggestions = async (persona, businessInfo) => {
  try {
    const res = await axios.post(`${INVEST_AI_URL}/suggest`, { persona, businessInfo });
    return res.data.reply || "💡 Keep track of daily expenses to save more effectively! It's okay to start small.";
  } catch (err) {
    console.error("Backend Gemini Error (Suggest):", err);
    // Return a friendly default if the API fails
    return "💡 Tip: Save a small portion of your daily earnings to build a big safety net for your business!";
  }
};

export const askArthika = async (persona, question, language = "en-IN", businessInfo) => {
  try {
    const res = await axios.post(`${INVEST_AI_URL}/ask`, { persona, question, language, businessInfo });
    return res.data.reply || "I'm here to help! Could you please try rephrasing your question?";
  } catch (err) {
    console.error("Backend Gemini Chat Error:", err);
    const backendDetail = err.response?.data?.details;
    // If there's a specific API error, show it briefly, otherwise show fallback
    return backendDetail
      ? `Arthika is resting briefly: ${backendDetail}`
      : "I'm having a little trouble connecting. Please try asking again in a moment!";
  }
};