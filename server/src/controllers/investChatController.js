const { GoogleGenerativeAI } = require("@google/generative-ai");

const handleSuggest = async (req, res) => {
    const { persona } = req.body;
    try {
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: "Missing API Key. Check server .env" });
        }
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `You are an empathetic, encouraging financial mentor for Indian women managing finances. 
        Your job is strictly to answer questions related to Saving Goals, Loans, Government Schemes, and Financial tracking on the Invest and Save page. Do not act as a general chatbot.
        The user identifies as a ${persona}. Based on this profile, give 2 short, practical, and highly encouraging financial tips for today. Keep titles and phrases simple and easy to understand so they translate well. Avoid intimidating jargon. Do not use markdown heading tags.`;

        const result = await model.generateContent([prompt]);
        return res.status(200).json({ reply: result.response.text() });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to generate suggestions." });
    }
};

const handleAsk = async (req, res) => {
    const { persona, question, language } = req.body;
    
    const langMap = {
        "en-IN": "English", "hi-IN": "Hindi", "mr-IN": "Marathi",
        "gu-IN": "Gujarati", "bn-IN": "Bengali", "te-IN": "Telugu",
        "ta-IN": "Tamil", "ur-IN": "Urdu", "ml-IN": "Malayalam"
    };
    const spokenLang = langMap[language] || "English";

    try {
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: "Missing API Key. Check server .env" });
        }
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `You are Arthika, a friendly and empowering financial assistant for Indian women. 
        Your job is strictly to answer questions related to Saving Goals, Loans, Government Schemes, and Financial tracking on the Invest and Save page. Do not act as a general chatbot.
        The user is a ${persona}. Ask: "${question}".
        Reply in this exact language: ${spokenLang}. Keep it very short, simple and encouraging.`;

        const result = await model.generateContent([prompt]);
        return res.status(200).json({ reply: result.response.text() });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to answer." });
    }
};

module.exports = { handleSuggest, handleAsk };
