import { API } from './api.js';
import { UI } from './ui.js';

// We use 'export const' to ensure index.html can find it exactly
export const Game = {
    state: {
        score: 0,
        currentLevel: 1,
        scenarios: [],
        usedIndexes: new Set(),
        currentScenario: null
    },

    async init() {
        console.log("Game.init() started");
        try {
            this.state.scenarios = await API.getScenarios();
            
            // Reset state for a fresh game
            this.state.score = 0;
            this.state.usedIndexes.clear();
            this.state.currentLevel = 1;
            
            UI.init();
            this.nextQuestion();
        } catch (err) {
            console.error("Game failed to initialize:", err);
        }
    },

    getRank(score) {
        if (score < 1000) return "Broke Energy";
        if (score < 10000) return "New Money";
        if (score < 50000) return "Old Money Elite";
        if (score < 200000) return "God Tier Billionaire";
        return "Reality Distorter";
    },

    handleChoice(choiceIndex) {
        const scenario = this.state.currentScenario;
        if (!scenario) return;

        const addedScore = scenario.luxuryScore[choiceIndex];
        const outcome = scenario.outcomes[choiceIndex];

        this.state.score += addedScore;
        
        // Update the Level based on total score
        if (this.state.score > 2000 && this.state.score < 15000) this.state.currentLevel = 2;
        if (this.state.score >= 15000) this.state.currentLevel = 3;

        // Update UI Header
        const scoreDisplay = document.getElementById('score');
        const rankDisplay = document.getElementById('rank');
        if (scoreDisplay) scoreDisplay.innerText = this.state.score.toLocaleString();
        if (rankDisplay) rankDisplay.innerText = this.getRank(this.state.score);

        UI.showFeedback(outcome, addedScore);
        
        // Show next question or end game after delay
        setTimeout(() => {
            if (this.state.usedIndexes.size >= this.state.scenarios.length) {
                this.finishGame();
            } else {
                this.nextQuestion();
            }
        }, 2000);
    },

    nextQuestion() {
        // Find unused scenarios that match current unlocked level
        const available = this.state.scenarios.filter((s, index) => 
            s.level <= this.state.currentLevel && !this.state.usedIndexes.has(index)
        );

        if (available.length === 0) {
            this.finishGame();
            return;
        }

        // Pick a random one from available pool
        const randomScenario = available[Math.floor(Math.random() * available.length)];
        this.state.currentScenario = randomScenario;
        
        // Track that we used this specific scenario ID
        const originalIndex = this.state.scenarios.findIndex(s => s.id === randomScenario.id);
        this.state.usedIndexes.add(originalIndex);

        UI.renderScenario(randomScenario);
    },

    finishGame() {
        console.log("Game finished. Final Score:", this.state.score);
        UI.showResults(this.state.score, this.getRank(this.state.score));
        API.submitScore('The Elite', this.state.score, this.getRank(this.state.score));
    }
};