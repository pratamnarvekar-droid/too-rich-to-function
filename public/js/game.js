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
        this.state.scenarios = await API.getScenarios();
        this.state.score = 0;
        this.state.currentLevel = 1;
        this.state.usedIndexes.clear();
        
        UI.init();
        this.nextQuestion();
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

        // Update levels automatically based on wealth
        if (this.state.score > 1000 && this.state.score < 10000) this.state.currentLevel = 2;
        if (this.state.score >= 10000) this.state.currentLevel = 3;

        // Update Top Bar
        document.getElementById('rank').innerText = this.getRank(this.state.score);
        document.getElementById('score').innerText = this.state.score.toLocaleString();

        UI.showFeedback(outcome, addedScore);
        
        // Wait 2 seconds, then next question
        setTimeout(() => {
            if (this.state.usedIndexes.size >= this.state.scenarios.length) {
                this.finishGame();
            } else {
                this.nextQuestion();
            }
        }, 2000);
    },

    nextQuestion() {
        // Find questions that match current level and haven't been used
        const available = this.state.scenarios.filter((s, index) => 
            s.level <= this.state.currentLevel && !this.state.usedIndexes.has(index)
        );

        if (available.length === 0) {
            this.finishGame();
            return;
        }

        const randomScenario = available[Math.floor(Math.random() * available.length)];
        
        // Save to state for handleChoice
        this.state.currentScenario = randomScenario;
        
        // Mark as used
        const scenarioIndex = this.state.scenarios.findIndex(s => s.id === randomScenario.id);
        this.state.usedIndexes.add(scenarioIndex);

        UI.renderScenario(randomScenario);
    },

    async finishGame() {
        const rank = this.getRank(this.state.score);
        UI.showResults(this.state.score, rank);
        await API.submitScore('The Tycoon', this.state.score, rank);
    }
};

export default Game;