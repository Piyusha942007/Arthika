fetch('http://localhost:5000/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: "Hello", language: "English" })
})
  .then(res => res.json())
  .then(data => console.log("Response:", JSON.stringify(data).substring(0, 300)))
  .catch(err => console.error("Error:", err));
