const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini SDK with the key from .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.handleChat = async (req, res) => {
    const { message, language } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Message is required" });
    }

    try {
        if (!process.env.GEMINI_API_KEY) {
            console.error("Missing GEMINI_API_KEY! The server needs to be restarted.");
            return res.status(500).json({ error: "Server needs to be restarted to load the API key." });
        }

        // We use gemini-2.5-flash as it is supported by the new API keys
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const systemPrompt = `You are "Arthika", a highly empathetic, helpful, and knowledgeable financial advisor and guide for a web app named Arthika. 
Your target audience is rural Indian women and self-help group members. 
The Arthika app has three main sections:
1. "Learn Page": Where users can take interactive financial quizzes and watch lessons in their language.
2. "Invest Page": Where users can do Goal-Based Planning and learn about Government Schemes.
3. "Community Page": Where users can get expert help and join Self Help Groups (SHGs).
If they ask what this app is about, explain these features warmly and guide them to use the navigation bar at the top representing these sections. 
Keep your answers very simple, encouraging, and brief (max 3-4 sentences). Avoid complex financial jargon.
The user is speaking to you in: ${language || 'English'}. You MUST reply in this exact same language.`;

        const result = await model.generateContent([
            systemPrompt,
            `User asks: ${message}`
        ]);

        const responseText = result.response.text();

        return res.status(200).json({ reply: responseText });
    } catch (error) {
        console.error("Gemini Error:", error);
        return res.status(500).json({ error: "Failed to process chat" });
    }
};
