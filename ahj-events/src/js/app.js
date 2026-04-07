import goblin from '../img/goblin.png';
import hammer from '../img/hammer.png';
import bams from '../img/bams.png';

import { GameField } from '../components/field.js';
import { Goblin } from '../components/goblin.js';
import { CellClickHandler } from '../components/cellHandler.js';

const GRID_SIZE = 4;
const INTERVAL_MS = 1000;
const MAX_CONSECUTIVE_MISSES = 5;

export default function App() {
    const field = new GameField(GRID_SIZE);
    const { container, board } = field.render();

    const legend = GameField.createGameLegend();
    const root = document.querySelector('.game-field');

    let currentIndex = Math.floor(Math.random() * board.length);
    const goblinInstance = new Goblin(goblin, board, currentIndex);
    const scoreManager = new CellClickHandler(hammer, bams, board, goblinInstance.img);

    let gameInterval = null;
    let gameRunning = false;
    let hasAttemptedThisTurn = false;

    function createUI() {
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';
        buttonContainer.style.cssText = 'display: flex; gap: 10px; margin-bottom: 15px;';

        const startStopButton = document.createElement('button');
        startStopButton.className = 'game-control-btn';
        startStopButton.textContent = 'Старт';

        buttonContainer.append(startStopButton);
        root.append(buttonContainer, legend, container);

        startStopButton.addEventListener('click', () => {
            if (gameRunning) {
                stopGame();
            } else {
                startGame();
            }
        });

        document.addEventListener('dragstart', (event) => {
            if (event.target.tagName === 'IMG') event.preventDefault();
        }, { passive: false });

        return startStopButton;
    }

    const startStopButton = createUI();

    function showGoblin() {
        if (goblinInstance.img) {
            goblinInstance.img.style.display = 'block';
            goblinInstance.img.style.visibility = 'visible';
            goblinInstance.img.style.opacity = '1';
        }
    }

    function hideGoblin() {
        if (goblinInstance.img) {
            goblinInstance.img.style.display = 'none';
        }
    }

    function startGame() {
        if (gameRunning) return;

        scoreManager.resetScores();
        hasAttemptedThisTurn = false;
        gameRunning = true;

        clearShowEndMessage();

        scoreManager.enableClicks();

        showGoblin();

        currentIndex = Math.floor(Math.random() * board.length);
        goblinInstance.moveTo(currentIndex);

        startStopButton.textContent = 'Стоп';
        updateScoreDisplay();

        gameInterval = setInterval(gameTick, INTERVAL_MS);
    }

    function gameTick() {
        const nextIndex = GameField.pickRandomIndex(currentIndex, GRID_SIZE);
        goblinInstance.moveTo(nextIndex);
        currentIndex = goblinInstance.getCurrentPosition();

        if (!hasAttemptedThisTurn) {
            scoreManager.addMiss();
        }

        // Проверяем условия окончания игры (5 последовательных промахов)
        if (scoreManager.getMissesGoblins() >= MAX_CONSECUTIVE_MISSES) {
            updateScoreDisplay();
            endGame();
            return;
        }

        hasAttemptedThisTurn = false;
        updateScoreDisplay();
    }

    function stopGame() {
        if (gameInterval) {
            clearInterval(gameInterval);
            gameInterval = null;
        }

        gameRunning = false;
        scoreManager.disableClicks();
        hideGoblin();
        startStopButton.textContent = 'Старт';

        clearShowEndMessage();
    }

    function endGame() {
        stopGame();
        showEndMessage();
    }

    function showEndMessage() {
        const oldMessage = document.querySelector('.end-message');
        if (oldMessage) oldMessage.remove();

        const endMsg = document.createElement('p');
        endMsg.className = 'end-message';
        endMsg.textContent = `Игра завершена! Пропущено ${MAX_CONSECUTIVE_MISSES} появлений гоблина подряд.`;
        endMsg.style.cssText = 'color: #f44336; font-weight: bold; margin-top: 20px;';
        root.append(endMsg);
    }

    function clearShowEndMessage() {
        const endMsg = document.querySelector('.end-message');
        if (endMsg) endMsg.remove();
    }

    function updateScoreDisplay() {
        const score = scoreManager.getScore();
        const misses = scoreManager.getMisses();
        const consecutiveMisses = scoreManager.getConsecutiveMisses();

        let scoreDisplay = document.querySelector('.score-display');
        if (!scoreDisplay) {
            scoreDisplay = document.createElement('div');
            scoreDisplay.className = 'score-display';
            scoreDisplay.style.cssText = 'margin: 10px 0; font-weight: bold;';
            const buttonContainer = document.querySelector('.button-container');
            buttonContainer.after(scoreDisplay);
        }

        scoreDisplay.innerHTML = `
            <div>Попадания: ${score} / Промахи: ${misses}</div>
            <div> Пропущено гоблинов подряд: ${consecutiveMisses}</div>
        `;
    }

    hideGoblin();
    updateScoreDisplay();

    return {
        stopGame,
        getScore: () => scoreManager.getScore()
    };
}