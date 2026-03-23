import https from 'https';
import "dotenv/config";

const key = process.env.GEMINI_API_KEY;

function check(url) {
    return new Promise((resolve) => {
        https.get(`${url}?key=${key}`, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    if (res.statusCode === 200) {
                        console.log(`--- MODELS for ${url} ---`);
                        json.models.forEach(m => console.log(m.name));
                    } else {
                        console.log(`Error ${res.statusCode} for ${url}`);
                    }
                } catch (e) { console.log("Parse error"); }
                resolve();
            });
        });
    });
}

async function run() {
    await check("https://generativelanguage.googleapis.com/v1beta/models");
}

run();
