export const UI = {
    init() {
        const container = document.getElementById('game-container');
        container.innerHTML = '<div class="card"><h2>Loading Luxury...</h2></div>';
    },

    renderScenario(data) {
        console.log("Rendering Scenario:", data.id);
        const container = document.getElementById('game-container');
        container.innerHTML = `
            <div class="card fade-in">
                <p style="color: #d4af37; font-size: 0.7rem; letter-spacing: 2px;">LUXURY LVL ${data.level}</p>
                <h2>${data.problem}</h2>
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
            <div class="card fade-in">
                <h1>💰</h1>
                <p style="font-size: 1.2rem; font-style: italic;">"${message}"</p>
                <h2 style="color: #d4af37;">+${points.toLocaleString()} Points</h2>
            </div>
        `;
    },

    showResults(score, rank) {
        const container = document.getElementById('game-container');
        container.innerHTML = `
            <div class="card">
                <h1>GAME OVER</h1>
                <h2 style="color: #d4af37;">${rank}</h2>
                <p>Final Score: ${score.toLocaleString()}</p>
                <button onclick="location.reload()">Restart Life</button>
            </div>
        `;
    }
};