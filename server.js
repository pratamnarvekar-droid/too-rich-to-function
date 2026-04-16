const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

const DATA_PATH = path.join(__dirname, 'data');

// Helper to read JSON files
const readData = (file) => JSON.parse(fs.readFileSync(path.join(DATA_PATH, file)));
const writeData = (file, data) => fs.writeFileSync(path.join(DATA_PATH, file), JSON.stringify(data, null, 2));

// API: Get Scenarios
app.get('/api/scenarios', (req, res) => {
    const data = readData('scenarios.json');
    res.json(data);
});

// API: Get Daily Challenge (based on date)
app.get('/api/daily', (req, res) => {
    const data = readData('scenarios.json');
    const day = new Date().getDate();
    const dailyScenario = data[day % data.length];
    res.json(dailyScenario);
});

// API: Leaderboard
app.get('/api/leaderboard', (req, res) => {
    const leaderboard = readData('leaderboard.json');
    res.json(leaderboard.sort((a, b) => b.score - a.score).slice(0, 10));
});

app.post('/api/leaderboard', (req, res) => {
    const { name, score, rank } = req.body;
    const leaderboard = readData('leaderboard.json');
    leaderboard.push({ name, score, rank, date: new Date() });
    writeData('leaderboard.json', leaderboard);
    res.status(201).json({ success: true });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));