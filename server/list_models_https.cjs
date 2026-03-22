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
                console.log("MODELS:", JSON.stringify(parsed, null, 2));
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
