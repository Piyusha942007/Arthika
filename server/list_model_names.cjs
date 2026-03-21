const https = require('https');
const dotenv = require('dotenv');
dotenv.config();

function list() {
    const key = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
    
    https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            try {
                const parsed = JSON.parse(data);
                if (parsed.models) {
                    console.log("MODEL NAMES:");
                    parsed.models.forEach(m => console.log(m.name));
                } else {
                    console.log("No models found:", data);
                }
            } catch (e) {
                console.error("Parse Error:", e);
                console.log("Raw Data:", data);
            }
        });
    }).on('error', (err) => {
        console.error("Request Error:", err.message);
    });
}
list();
