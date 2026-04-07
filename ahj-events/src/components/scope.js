// Максимальное количество пропусков
const MAX_MISSED = 5;

export class GameScore {
    constructor() {
        this.score = 0;
        this.missed = 0;

        this.isRunning = false;
        this.gameInterval = null;

        this.scoreElement = null;
        this.missedElement = null;
        this.stopButton = null;
        this.startButton = null;
        this.messageElement = null;
    }

    // Создает пользовательский интерфейс для управления игрой
    createUI() {
        const root = document.querySelector('.game-field');

        // Создаем панель управления
        const controlPanel = document.createElement('div');
        controlPanel.className = 'control-panel';

        // Счетчик очков
        const scoreContainer = document.createElement('div');
        scoreContainer.className = 'score-container';
        scoreContainer.innerHTML = 'Очки: <span class="score-value">0</span>';
        this.scoreElement = scoreContainer.querySelector('.score-value');

        // Счетчик пропущенных
        const missedContainer = document.createElement('div');
        missedContainer.className = 'missed-container';
        missedContainer.innerHTML = 'Пропущено: <span class="missed-value">0/5</span>';
        this.missedElement = missedContainer.querySelector('.missed-value');

        // Кнопка Стоп
        this.stopButton = document.createElement('button');
        this.stopButton.textContent = 'Стоп';
        this.stopButton.addEventListener('click', () => this.stopGame());

        // Кнопка Старт
        this.startButton = document.createElement('button');
        this.startButton.textContent = 'Старт';
        this.startButton.addEventListener('click', () => this.startGame());

        controlPanel.append(this.startButton, this.stopButton, scoreContainer, missedContainer);
        root.prepend(controlPanel);

        return controlPanel;
    }

    // Увеличивает счет попаданий на 1 и сбрасывает счетчик пропусков
    incrementScore() {
        this.score += 1;
        this.resetMissed();
        this.updateUI();
        return this.score;
    }

    // Увеличивает счет пропусков на 1, проверяет условие окончания игры
    incrementMissed() {
        this.missed += 1;
        this.updateUI();

        if (this.missed >= MAX_MISSED) {
            return true;
        }
        return false;
    }

    // Обновляет отображение счетчиков в интерфейсе
    updateUI() {
        if (this.scoreElement) {
            this.scoreElement.textContent = this.score;
        }
        if (this.missedElement) {
            this.missedElement.textContent = `${this.missed}/${MAX_MISSED}`;
        }
    }

    // Сбрасывает все счетчики и состояние
    reset() {
        this.score = 0;
        this.missed = 0;
        this.updateUI();
        this.clearMessage();
    }

    // Сбрасывает только счетчик пропусков. Используется при попадании по гоблину
    resetMissed() {
        this.missed = 0;
        this.updateUI();
    }

    startGame() {
        this.isRunning = true;
        this.clearMessage();
        if (this.stopButton) this.stopButton.disabled = false;
        if (this.startButton) this.startButton.disabled = true;
    }

    stopGame() {
        this.isRunning = false;
        this.clearGameInterval();
        if (this.stopButton) this.stopButton.disabled = true;
        if (this.startButton) this.startButton.disabled = false;
    }

    // Возвращает признак активности игры
    getIsRunning() {
        return this.isRunning;
    }

    // Завершает работу экземпляра класса
    destroy() {
        this.clearGameInterval();
        if (this.stopButton && this.stopButton.parentNode) {
            this.stopButton.parentNode.removeChild(this.stopButton);
        }
        if (this.startButton && this.startButton.parentNode) {
            this.startButton.parentNode.removeChild(this.startButton);
        }
    }

    // Устанавливает игровой интервал
    setGameInterval(interval) {
        if (this.gameInterval) {
            clearInterval(this.gameInterval);
        }
        this.gameInterval = interval;
    }

    // Очищает игровой интервал
    clearGameInterval() {
        if (this.gameInterval) {
            clearInterval(this.gameInterval);
            this.gameInterval = null;
        }
    }
}