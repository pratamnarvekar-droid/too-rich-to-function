export const UI = {
    init() {
        // Clear the screen for the first question
        document.getElementById('game-container').innerHTML = '<p>Loading your inheritance...</p>';
    },

    renderScenario(data) {
        const container = document.getElementById('game-container');
        container.innerHTML = `
            <div class="card fade-in">
                <p style="color: #888; font-size: 0.8rem;">SCENARIO LEVEL ${data.level}</p>
                <h2 style="margin-bottom: 20px;">${data.problem}</h2>
                <div class="choices">
                    ${data.choices.map((c, i) => `
                        <button onclick="window.makeChoice(${i})">${c}</button>
                    `).join('')}
                </div>
            </div>
        `;
    },

    showFeedback(message, points) {
        const container = document.getElementById('game-container');
        container.innerHTML = `
            <div class="card">
                <h1 style="font-size: 3rem;">${points > 0 ? '💰' : '📉'}</h1>
                <p>${message}</p>
                <h2 style="color: #fff">+${points} Luxury Points</h2>
            </div>
        `;
        // Update Score/Rank in header
        document.getElementById('score').innerText = window.currentScore;
    },

    showResults(score, rank) {
        const container = document.getElementById('game-container');
        container.innerHTML = `
            <div class="card">
                <h1>Game Over</h1>
                <p>Your Final Status:</p>
                <h2 style="font-size: 2rem;">${rank}</h2>
                <p>Total Score: ${score}</p>
                <button onclick="location.reload()">Re-buy your life</button>
            </div>
        `;
    }
};