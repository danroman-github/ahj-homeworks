export class Goblin {
    constructor(src, board, initialIndex) {
        this.board = board;
        this.index = initialIndex;
        this.img = new Image();
        this.img.src = src;
        this.img.alt = 'Goblin';
        this.img.className = 'goblin';
        this.placeOnBoard();
    }

    // Метод размещения гоблина на игровой панели
    placeOnBoard() {
        const cell = this.board[this.index];
        cell.append(this.img);
    }

    // Метод перемещения гоблина на новую позицию
    moveTo(newIndex) {
        if (newIndex >= 0 && newIndex < this.board.length) {
            this.index = newIndex;
            this.placeOnBoard();
        }
    }

    // Метод получения текущей позиции гоблина
    getCurrentPosition() {
        return this.index;
    }
}
