import fetch from 'node-fetch';
import dotenv from "dotenv";
dotenv.config();

async function list() {
    const key = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        console.log("MODELS:", JSON.stringify(data, null, 2));
    } catch (e) {
        console.error(e);
    }
}
list();
