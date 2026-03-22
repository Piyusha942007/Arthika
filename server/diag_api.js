import https from 'https';
import "dotenv/config";

const key = process.env.GEMINI_API_KEY;

function check(url) {
    return new Promise((resolve) => {
        console.log(`Checking ${url}...`);
        https.get(`${url}?key=${key}`, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                console.log(`Status for ${url}: ${res.statusCode}`);
                try {
                    const json = JSON.parse(data);
                    if (res.statusCode === 200) {
                        console.log("Models:", json.models.map(m => m.name));
                    } else {
                        console.log("Error Body:", JSON.stringify(json, null, 2));
                    }
                } catch (e) {
                    console.log("Raw Body:", data);
                }
                resolve();
            });
        }).on('error', (err) => {
            console.log(`Failed on ${url}: ${err.message}`);
            resolve();
        });
    });
}

async function run() {
    await check("https://generativelanguage.googleapis.com/v1beta/models");
    await check("https://generativelanguage.googleapis.com/v1/models");
}

run();
