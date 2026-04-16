import { API } from './api.js';
import { UI } from './ui.js';

const Game = {
    state: {
        score: 0,
        currentLevel: 1,
        scenarios: [],
        usedIndexes: new Set(),
        currentScenario: null
    },

    async init() {
        console.log("Initializing Game...");
        try {
            this.state.scenarios = await API.getScenarios();
            console.log("Scenarios loaded:", this.state.scenarios.length);
            
            this.state.score = 0;
            this.state.usedIndexes.clear();
            this.state.currentLevel = 1;
            
            UI.init();
            this.nextQuestion();
        } catch (err) {
            console.error("Failed to start game:", err);
        }
    },

    getRank(score) {
        if (score < 1000) return "Broke Energy";
        if (score < 10000) return "New Money";
        if (score < 50000) return "Old Money Elite";
        return "God Tier Billionaire";
    },

    handleChoice(choiceIndex) {
        const scenario = this.state.currentScenario;
        if (!scenario) {
            console.error("No current scenario found!");
            return;
        }

        const addedScore = scenario.luxuryScore[choiceIndex];
        const outcome = scenario.outcomes[choiceIndex];

        this.state.score += addedScore;
        
        // Update UI
        document.getElementById('rank').innerText = this.getRank(this.state.score);
        document.getElementById('score').innerText = this.state.score.toLocaleString();

        UI.showFeedback(outcome, addedScore);
        
        setTimeout(() => {
            if (this.state.usedIndexes.size >= this.state.scenarios.length) {
                this.finishGame();
            } else {
                this.nextQuestion();
            }
        }, 2000);
    },

    nextQuestion() {
        const available = this.state.scenarios.filter((s, index) => 
            s.level <= this.state.currentLevel && !this.state.usedIndexes.has(index)
        );

        if (available.length === 0) {
            console.log("No more scenarios available.");
            this.finishGame();
            return;
        }

        const randomScenario = available[Math.floor(Math.random() * available.length)];
        this.state.currentScenario = randomScenario;
        
        const idx = this.state.scenarios.findIndex(s => s.id === randomScenario.id);
        this.state.usedIndexes.add(idx);

        UI.renderScenario(randomScenario);
    },

    finishGame() {
        UI.showResults(this.state.score, this.getRank(this.state.score));
    }
};

export default Game;