export const UI = {
    init() {
        document.getElementById('game-container').innerHTML = '<p style="color: #d4af37;">Consulting with your bankers...</p>';
    },

    renderScenario(data) {
        const container = document.getElementById('game-container');
        container.innerHTML = `
            <div class="card fade-in">
                <p style="color: #d4af37; font-size: 0.7rem; letter-spacing: 2px; text-transform: uppercase;">Luxury Crisis Level ${data.level}</p>
                <h2>${data.problem}</h2>
                <div class="choices">
                    ${data.choices.map((c, i) => `
                        <button onclick="makeChoice(${i})">${c}</button>
                    `).join('')}
                </div>
            </div>
        `;
    },

    showFeedback(message, points) {
        const container = document.getElementById('game-container');
        container.innerHTML = `
            <div class="card fade-in">
                <h1 style="font-size: 3rem;">${points > 1000 ? '💎' : '💰'}</h1>
                <p style="font-style: italic; font-size: 1.2rem; margin-bottom: 20px;">"${message}"</p>
                <h2 style="color: #d4af37;">+ ${points.toLocaleString()} Points</h2>
            </div>
        `;
    },

    showResults(score, rank) {
        const container = document.getElementById('game-container');
        container.innerHTML = `
            <div class="card fade-in">
                <p style="text-transform: uppercase; color: #d4af37;">Final Inheritance Status</p>
                <h1 style="font-size: 2.5rem; margin: 10px 0;">${rank}</h1>
                <p>Total Luxury Score: <strong>${score.toLocaleString()}</strong></p>
                <button onclick="location.reload()" style="margin-top: 20px; border-color: #d4af37;">Re-invest in your lifestyle</button>
            </div>
        `;
    }
};