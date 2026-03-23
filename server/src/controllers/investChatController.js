import { GoogleGenerativeAI } from "@google/generative-ai";

const handleSuggest = async (req, res) => {
    const { persona, businessInfo } = req.body;
    try {
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: "Missing API Key. Check server .env" });
        }

        // Replace your initialization lines with these:
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        // Use the currently available model
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
        });
        let personaContext = "";
        const lowerPersona = persona?.toLowerCase() || "";

        if (lowerPersona.includes("housewife")) {
            personaContext = "The user is a housewife. Focus your tips on household budgeting, 'gullak' style savings from daily expenses, small micro-savings schemes (like Sukanya Samriddhi or Post Office RD), and perhaps turning a home hobby (like cooking or tailoring) into a tiny side-income.";
        } else if (lowerPersona.includes("working") || lowerPersona.includes("professional")) {
            personaContext = "The user is a working woman with a regular income. Focus your tips on salary budgeting, tax-saving investments (like ELSS or PPF), building a personal emergency fund, and starting small monthly SIPs for long-term wealth.";
        } else if (businessInfo) {
            personaContext = `The user is an entrepreneur running a ${businessInfo} business. Focus your tips on reinvesting profits, managing business cash flow, scaling their current work, and tracking business vs personal expenses separately.`;
        } else {
            personaContext = "The user is an Indian woman looking for financial growth. Provide practical tips on saving, avoiding debt, and exploring safe investment options tailored for her independent future.";
        }

        const prompt = `You are Arthika, an empathetic financial mentor for Indian women. 
        Context: ${personaContext}
        Based on this profile, give 2 distinct, short, and practical financial tips for today. 
        Avoid generic advice; make them actionable for her specific situation. 
        Keep it simple, friendly, and do not use markdown heading tags.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return res.status(200).json({ reply: response.text() });
    } catch (err) {
        console.error("Arthika Suggest Error:", err);
        return res.status(500).json({
            error: "Failed to generate suggestions.",
            details: err?.message || "Unknown error"
        });
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
            return res.status(500).json({ error: "Missing API Key." });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Using the currently available model
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `You are Arthika, a friendly financial assistant for Indian women. 
        Strictly answer questions related to Saving Goals, Loans, Government Schemes, Business Ideas, and Financial tracking.
        The user is a ${persona}. ${businessInfo ? `They run a business involving: ${businessInfo}.` : ""}
        Question: "${question}".
        Reply in this exact language: ${spokenLang}. 
        Offer advice on saving and growing their business. Keep it very short, simple, and empowering.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return res.status(200).json({ reply: response.text() });
    } catch (err) {
        console.error("Arthika Ask Error:", err);
        return res.status(500).json({
            error: "Failed to answer.",
            details: err?.message || "Gemini API issue"
        });
    }
};

export {
    handleSuggest as getSuggestions,
    handleAsk as askArthika
};