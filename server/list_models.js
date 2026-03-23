import "dotenv/config";

async function listModels() {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models?key=${process.env.GEMINI_API_KEY}`
  );
  const data = await response.json();
  if (data.models) {
    data.models
      .filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent'))
      .forEach(m => console.log(m.name));
  } else {
    console.log(JSON.stringify(data, null, 2));
  }
}

listModels();
