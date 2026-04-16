export const API = {
    async getScenarios() {
        try {
            const res = await fetch('/api/scenarios');
            return await res.json();
        } catch (err) {
            console.error("Error fetching scenarios:", err);
            return [];
        }
    },
    async submitScore(name, score, rank) {
        try {
            await fetch('/api/leaderboard', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, score, rank })
            });
        } catch (err) {
            console.error("Error submitting score:", err);
        }
    }
};