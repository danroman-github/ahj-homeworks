export class CellClickHandler {
    constructor(hammerSrc, bamsSrc, board, goblinImg) {
        this.hammerSrc = hammerSrc;
        this.bamsSrc = bamsSrc;
        this.board = board;
        this.goblinImg = goblinImg;
        this.score = 0;
        this.misses = 0;
        this.missedGoblins = 0;
        this.consecutiveMisses = 0;
        this.lastHitWasSuccessful = false;
        this.clicksEnabled = false;

        this._attachEventListeners();
    }

    // Создаем Bams эффект
    _createBamsEffect() {
        const effect = new Image();
        effect.src = this.bamsSrc;
        effect.alt = 'BAM!';
        effect.className = 'bams-effect';
        effect.style.cssText = 'position: absolute; z-index: 10; pointer-events: none;';
        return effect;
    }

    // Всплывающее сообщение попал/мимо
    _createHitMessage(text, color = '#4CAF50') {
        const message = document.createElement('div');
        message.className = 'hit-message';
        message.textContent = text;
        message.style.cssText = `
            position: absolute;
            z-index: 11;
            color: ${color};
            font-weight: bold;
            font-size: 18px;
            pointer-events: none;
            text-shadow: 1px 1px 2px black;
        `;
        return message;
    }

    // Наблюдение событий ячеек
    _attachEventListeners() {
        this.board.forEach((cell) => {
            cell.addEventListener('click', (event) => this._handleCellClick(event, cell));
        });
    }

    // Обработчик события клика по ячейке
    _handleCellClick(event, cell) {
        if (!this.clicksEnabled) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }

        if (cell.querySelector('.hammer')) return;

        const hammerImg = new Image();
        hammerImg.src = this.hammerSrc;
        hammerImg.alt = 'Hammer';
        hammerImg.className = 'hammer';
        hammerImg.style.cssText = 'position: absolute; z-index: 5; pointer-events: none;';
        cell.append(hammerImg);

        const hitGoblin = cell.contains(this.goblinImg);

        this.lastHitWasSuccessful = hitGoblin;

        if (hitGoblin) {
            this.score++;
            this.missedGoblins = 0;
            this.consecutiveMisses = 0;
            this._showHitEffect(cell);
        } else {
            this.misses++;
            this.missedGoblins++;
            this.consecutiveMisses++;
            this._showMissEffect(cell);
        }

        setTimeout(() => hammerImg.remove(), 300);
    }

    // Анимация попадания Bams
    _showHitEffect(cell) {
        const bamsEffect = this._createBamsEffect();
        const hitMessage = this._createHitMessage('ПОПАЛ!');

        cell.append(bamsEffect, hitMessage);

        if (this.goblinImg) {
            this.goblinImg.style.opacity = '0.3';
        }

        setTimeout(() => {
            bamsEffect.remove();
            hitMessage.remove();
            if (this.goblinImg) {
                this.goblinImg.style.opacity = '1';
            }
        }, 500);
    }

    // Анимация промаха
    _showMissEffect(cell) {
        const missMessage = this._createHitMessage('МИМО!', '#f44336');
        cell.append(missMessage);

        setTimeout(() => missMessage.remove(), 500);
    }

    enableClicks() {
        this.clicksEnabled = true;
    }

    disableClicks() {
        this.clicksEnabled = false;
    }

    // Статус последнего удара
    wasLastMoveHit() {
        return this.lastHitWasSuccessful;
    }

    getScore() {
        return this.score;
    }

    getMisses() {
        return this.misses;
    }

    getMissesGoblins() {
        return this.missedGoblins;
    }

    getConsecutiveMisses() {
        return this.consecutiveMisses;
    }

    resetScores() {
        this.score = 0;
        this.misses = 0;
        this.missedGoblins = 0;
        this.consecutiveMisses = 0;
        this.lastHitWasSuccessful = false;
        this.clicksEnabled = false;
    }

    addMiss() {
        this.misses++;
        this.missedGoblins++;
        this.consecutiveMisses++;
        this.lastHitWasSuccessful = false;
    }
}