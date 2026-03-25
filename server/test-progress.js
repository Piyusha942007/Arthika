async function testProgressLatency() {
    const userId = "test-user-id-" + Date.now();
    const url = "http://localhost:5000/api/lessons/progress?lang=en&t=" + Date.now();
    
    console.log("Testing latency for:", url);
    const start = Date.now();
    try {
        const res = await fetch(url, {
            headers: { 'x-user-id': userId }
        });
        const duration = Date.now() - start;
        const data = await res.json();
        console.log("SUCCESS");
        console.log("Status:", res.status);
        console.log("Data:", JSON.stringify(data));
        console.log("Duration:", duration, "ms");
    } catch (e) {
        const duration = Date.now() - start;
        console.error("FAILED after", duration, "ms");
        console.error("Error:", e.message);
    }
}

testProgressLatency();
