const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// This handles the EXACT URL your frontend is calling
app.get('/goals', (req, res) => {
    res.json([]); 
});

module.exports = app;