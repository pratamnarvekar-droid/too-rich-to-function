import { API } from './api.js';
import { UI } from './ui.js';

const Game = {
    state: {
        score: 0,
        currentLevel: 1,
        scenarios: [],
        usedIndexes: new Set(),
        lastIndex: -1
    },

    async init() {
        this.state.scenarios = await API.getScenarios();
        this.state.score = 0;
        window.currentScore = 0;
        this.state.usedIndexes.clear();
        UI.init();
        this.nextQuestion();
    },

    getRank(score) {
        if (score < 500) return "Broke Energy";
        if (score < 5000) return "New Money";
        if (score < 50000) return "Old Money Elite";
        if (score < 500000) return "God Tier Billionaire";
        return "Reality Distorter";
    },

    handleChoice(choiceIndex) {
        const scenario = this.state.scenarios[this.state.lastIndex];
        const addedScore = scenario.luxuryScore[choiceIndex];
        const outcome = scenario.outcomes[choiceIndex];

        this.state.score += addedScore;
        window.currentScore = this.state.score;
        
        // Progression Logic: Unlock levels based on score
        if (this.state.score > 1000 && this.state.score < 10000) this.state.currentLevel = 2;
        if (this.state.score >= 10000) this.state.currentLevel = 3;

        // Update Rank Display in Header
        const rankEl = document.getElementById('rank');
        const scoreEl = document.getElementById('score');
        if (rankEl) rankEl.innerText = this.getRank(this.state.score);
        if (scoreEl) scoreEl.innerText = this.state.score.toLocaleString();

        UI.showFeedback(outcome, addedScore);
        
        setTimeout(() => {
            if (this.state.usedIndexes.size >= this.state.scenarios.length) {
                this.finishGame();
            } else {
                this.nextQuestion();
            }
        }, 2500);
    },

    nextQuestion() {
        // Find questions that match current level or lower, and haven't been used
        const available = this.state.scenarios.filter((s, index) => 
            s.level <= this.state.currentLevel && !this.state.usedIndexes.has(index)
        );

        if (available.length === 0) {
            this.finishGame();
            return;
        }

        const randomScenario = available[Math.floor(Math.random() * available.length)];
        const actualIndex = this.state.scenarios.findIndex(s => s.id === randomScenario.id);
        
        this.state.lastIndex = actualIndex;
        this.state.usedIndexes.add(actualIndex);

        UI.renderScenario(randomScenario);
    },

    async finishGame() {
        const finalRank = this.getRank(this.state.score);
        UI.showResults(this.state.score, finalRank);
        await API.submitScore('The Elite One', this.state.score, finalRank);
    }
};

export default Game;