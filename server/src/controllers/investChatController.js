import { GoogleGenerativeAI } from "@google/generative-ai";

const handleSuggest = async (req, res) => {
    const { persona, businessInfo } = req.body;
    try {
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: "Missing API Key. Check server .env" });
        }
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `You are an empathetic, encouraging financial mentor for Indian women managing finances. 
        Your job is strictly to answer questions related to Saving Goals, Loans, Government Schemes, Business Ideas, and Financial tracking on the Invest and Save page. Do not act as a general chatbot.
        The user identifies as a ${persona}. ${businessInfo ? `They are currently running or interested in a business related to: ${businessInfo}.` : ""}
        Based on this profile and their possible business, give 2 short, practical, and highly encouraging financial tips for today. 
        Explicitly suggest ideas on how to save money for their business, customize goals for their business, and improve or scale their business (e.g., if it's an achaar business or similar). 
        Keep titles and phrases simple and easy to understand so they translate well. Avoid intimidating jargon. Do not use markdown heading tags.`;

        const result = await model.generateContent([prompt]);
        return res.status(200).json({ reply: result.response.text() });
    } catch (err) {
        console.error("EXACT ERROR IS:", err);
        return res.status(500).json({ error: "Failed to generate suggestions.", details: err ? String(err) : "Unknown error", stack: err?.stack });
    }
};

const handleAsk = async (req, res) => {
    const { persona, question, language, businessInfo } = req.body;

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
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `You are Arthika, a friendly and empowering financial assistant for Indian women. 
        Your job is strictly to answer questions related to Saving Goals, Loans, Government Schemes, Business Ideas, and Financial tracking on the Invest and Save page. Do not act as a general chatbot.
        The user is a ${persona}. ${businessInfo ? `They run a business involving: ${businessInfo}.` : ""}
        Ask: "${question}".
        Reply in this exact language: ${spokenLang}. 
        Explicitly offer advice on how to save money, tell them about their business, and give more ideas to decide more about their business. 
        Encourage them to set customized financial goals and add more features to their saving plan. 
        Keep it very short, simple, empowering and highly relevant.`;

        const result = await model.generateContent([prompt]);
        return res.status(200).json({ reply: result.response.text() });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to answer." });
    }
};
export {
    handleSuggest as getSuggestions,
    handleAsk as askArthika
};