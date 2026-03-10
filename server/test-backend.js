async function testBackend() {
    try {
        const response = await fetch("http://localhost:8000/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: "Hello", language: "Marathi" })
        });
        const text = await response.text();
        console.log("STATUS:", response.status);
        console.log("RESPONSE:", text);
    } catch (e) {
        console.error(e);
    }
}
testBackend();
