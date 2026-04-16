import { API } from './api.js';
import { UI } from './ui.js';

// Use 'export const' so the browser knows exactly what is being shared
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
            // Fetch scenarios from our backend
            this.state.scenarios = await API.getScenarios();
            
            // Reset game state
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

        // Update Score
        this.state.score += addedScore;
        
        // Progression Logic: Unlock level 2/3 as they get richer
        if (this.state.score > 2000 && this.state.score < 15000) this.state.currentLevel = 2;
        if (this.state.score >= 15000) this.state.currentLevel = 3;

        // Update the top UI bar
        const scoreDisplay = document.getElementById('score');
        const rankDisplay = document.getElementById('rank');
        if (scoreDisplay) scoreDisplay.innerText = this.state.score.toLocaleString();
        if (rankDisplay) rankDisplay.innerText = this.getRank(this.state.score);

        // Show funny outcome feedback
        UI.showFeedback(outcome, addedScore);
        
        // Brief pause before next question
        setTimeout(() => {
            if (this.state.usedIndexes.size >= this.state.scenarios.length) {
                this.finishGame();
            } else {
                this.nextQuestion();
            }
        }, 2200);
    },

    nextQuestion() {
        // Pool only scenarios from unlocked levels that haven't been played
        const available = this.state.scenarios.filter((s, index) => 
            s.level <= this.state.currentLevel && !this.state.usedIndexes.has(index)
        );

        if (available.length === 0) {
            this.finishGame();
            return;
        }

        // Pick a random scenario
        const randomScenario = available[Math.floor(Math.random() * available.length)];
        this.state.currentScenario = randomScenario;
        
        // Find and mark the index as used
        const originalIndex = this.state.scenarios.findIndex(s => s.id === randomScenario.id);
        this.state.usedIndexes.add(originalIndex);

        UI.renderScenario(randomScenario);
    },

    finishGame() {
        console.log("Ending game with score:", this.state.score);
        const finalRank = this.getRank(this.state.score);
        UI.showResults(this.state.score, finalRank);
        
        // Optional: Save to leaderboard
        API.submitScore('The Elite', this.state.score, finalRank);
    }
};