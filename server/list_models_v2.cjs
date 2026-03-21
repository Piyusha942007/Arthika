const https = require('https');
const dotenv = require('dotenv');
dotenv.config();

function list() {
    const key = process.env.GEMINI_API_KEY;
    // Try both v1 and v1beta
    const versions = ['v1', 'v1beta'];
    
    versions.forEach(v => {
        const url = `https://generativelanguage.googleapis.com/${v}/models?key=${key}`;
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    console.log(`--- MODELS for ${v} ---`);
                    if (parsed.models) {
                        parsed.models.forEach(m => {
                            console.log(`${m.name} | Methods: ${m.supportedGenerationMethods.join(',')}`);
                        });
                    } else {
                        console.log(`No models for ${v}:`, data.substring(0, 100));
                    }
                } catch (e) {
                    console.error(`Error for ${v}:`, e.message);
                }
            });
        });
    });
}
list();
