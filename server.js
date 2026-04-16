const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// 1. SETTINGS & MIDDLEWARE
const PORT = process.env.PORT || 3000;

// This tells Express to parse JSON data sent in requests
app.use(express.json());

// This tells Express exactly where your images/css/js files are
// path.join(__dirname) ensures Vercel finds the folder correctly
const PUBLIC_PATH = path.join(__dirname, 'public');
app.use(express.static(PUBLIC_PATH));

const DATA_PATH = path.join(__dirname, 'data');

// Helper functions to read/write JSON safely
const readData = (file) => {
    try {
        const filePath = path.join(DATA_PATH, file);
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (err) {
        console.error(`Error reading ${file}:`, err);
        return [];
    }
};

const writeData = (file, data) => {
    try {
        const filePath = path.join(DATA_PATH, file);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error(`Error writing ${file}:`, err);
    }
};

// 2. ROUTES

// Main Route: Serve the game's home page
app.get('/', (req, res) => {
    res.sendFile(path.join(PUBLIC_PATH, 'index.html'));
});

// API: Get all scenarios
app.get('/api/scenarios', (req, res) => {
    const data = readData('scenarios.json');
    res.json(data);
});

// API: Get daily challenge
app.get('/api/daily', (req, res) => {
    const data = readData('scenarios.json');
    const day = new Date().getDate();
    const dailyScenario = data[day % data.length];
    res.json(dailyScenario);
});

// API: Get Leaderboard
app.get('/api/leaderboard', (req, res) => {
    const leaderboard = readData('leaderboard.json');
    // Sort by score (highest first) and return top 10
    const sorted = leaderboard.sort((a, b) => b.score - a.score).slice(0, 10);
    res.json(sorted);
});

// API: Submit Score
app.post('/api/leaderboard', (req, res) => {
    const { name, score, rank } = req.body;
    const leaderboard = readData('leaderboard.json');
    
    leaderboard.push({ 
        name: name || 'Anonymous Tycoon', 
        score: score || 0, 
        rank: rank || 'Broke Energy',
        date: new Date().toISOString() 
    });
    
    writeData('leaderboard.json', leaderboard);
    res.status(201).json({ success: true });
});

// 3. START SERVER
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Public files served from: ${PUBLIC_PATH}`);
});

// Export for Vercel
module.exports = app;