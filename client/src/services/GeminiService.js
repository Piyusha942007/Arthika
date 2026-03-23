import axios from 'axios';
import API_BASE_URL from '../config/apiConfig';

const CHAT_API_URL = `${API_BASE_URL}/api/chat`;

export const getSuggestions = async (persona, businessInfo, goals) => {
  try {
    let prompt = `You are Arthika, a helpful financial advisor. Provide a short, 2-bullet daily AI suggestion. `;
    if (persona?.toLowerCase().includes("housewife")) {
       prompt += `The user is a HOUSEWIFE. Give ideas how she can save money for personal goals or kids. `;
    } else {
       prompt += `The user is a WORKING WOMAN / ENTREPRENEUR. ${businessInfo ? `Her active business is: "${businessInfo}". ` : ''}Give ideas on how to manage her salary and expand this business. `;
    }
    
    if (goals && goals.length > 0) {
       const goalsList = goals.map(g => `${g.title} (Target: ₹${g.targetAmount}, Saved: ₹${g.savedAmount || 0})`).join(", ");
       prompt += `Analyze her current saving goals: [${goalsList}]. Check exactly where she can add her money. For example, 'If you add 100 rupees to [Goal Name] you'll be X% closer to your goal'. Be specific. `;
    }

    const res = await axios.post(CHAT_API_URL, { message: prompt, language: "English" });
    return res.data.reply || "💡 Keep track of daily expenses to save more effectively! It's okay to start small.";
  } catch (err) {
    console.error("Backend Gemini Error (Suggest):", err);
    return "💡 Tip 1: Keep track of daily expenses to save more effectively! It's okay to start small.\n💡 Tip 2: Consistency is key.";
  }
};

export const askArthika = async (persona, question, languageName = "English", businessInfo, goals) => {
  try {
    let prompt = `You are Arthika, a friendly financial advisor for rural Indian women. `;
    if (persona?.toLowerCase().includes("housewife")) {
       prompt += `The user you are speaking to is a HOUSEWIFE. You MUST tailor your answer specifically toward household budgeting, saving for children's future, or starting a small home-based income. `;
    } else {
       prompt += `The user you are speaking to is a WORKING WOMAN or ENTREPRENEUR. You MUST tailor your answer specifically toward managing her salary, growing her income, and business expansion. `;
       if (businessInfo) {
           prompt += `Her specific business/work details are: "${businessInfo}". Use this to give accurate, personalized scaling ideas. `;
       }
    }
    
    if (goals && goals.length > 0) {
       const goalsList = goals.map(g => `${g.title} (Target: ₹${g.targetAmount}, Saved: ₹${g.savedAmount || 0})`).join(", ");
       prompt += `She has active financial goals: [${goalsList}]. If relevant, advise her on how she can allocate funds to reach them faster. `;
    }
    prompt += `User's Question: "${question}"`;

    const res = await axios.post(CHAT_API_URL, { message: prompt, language: languageName });
    return res.data.reply || "I'm having trouble connecting right now, but remember that saving even a little bit today is a win!";
  } catch (err) {
    console.error("Backend Gemini Chat Error:", err);
    return "I'm experiencing intermittent connection issues. Please try again soon!";
  }
};
