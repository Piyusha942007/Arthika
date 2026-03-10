const FormData = require('form-data');
const fs = require('fs');
const fetch = require('node-fetch');

async function testPost() {
    console.log("Running...");
    const form = new FormData();
    form.append('businessName', 'Food Business');
    form.append('location', 'Pune');

    try {
        const res = await fetch('http://localhost:8000/api/business', {
            method: 'POST',
            body: form
        });
        const data = await res.json();
        console.log("Done:", data);
    } catch (e) {
        console.error("Error:", e);
    }
}
testPost();
