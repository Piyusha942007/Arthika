import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

async function test() {
    console.log("Testing Gemini API...");
    console.log("Key prefix:", process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 5) : "NONE");
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    try {
        const result = await model.generateContent("Hello, are you working?");
        console.log("SUCCESS! Response:", result.response.text());
    } catch (err) {
        console.error("FAILURE! Error detail:");
        console.error(err);
    }
}

test();
