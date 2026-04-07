export class GameField {
    // @param {number} size - размер сетки (число строк и столбцов)
    constructor(size) {
        this.size = size;
        this.container = document.createElement('div');
        this.container.className = 'game';
        this.cells = [];
        this._generateCells();
    }

    // Генерируем ячейки игрового поля
    _generateCells() {
        for (let r = 0; r < this.size; r += 1) {
            for (let c = 0; c < this.size; c += 1) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = r;
                cell.dataset.col = c;
                this.container.append(cell);
                this.cells.push(cell);
            }
        }
    }

    // Возвращает объект с контейнером и массивом ячеек
    render() {
        return {
            container: this.container,
            board: this.cells
        };
    }

    // Создаёт и возвращает HTML-элемент описания игры
    static createGameLegend() {
        const legend = document.createElement('div');
        legend.className = 'legend';
        legend.textContent = 'Попади по гоблину! Пять промахов - конец игры';
        return legend;
    }

    // Преобразуем координаты (строк и столбцов) в индекс массива
    static getIndexFromRC(r, c, size) {
        return r * size + c;
    }

    // Генерация случайного индекса, кроме указанного
    static pickRandomIndex(excludeIndex, size = this.size) {
        let idx;
        const maxAttempts = 20;

        let attempts = 0;
        do {
            const r = Math.floor(Math.random() * size);
            const c = Math.floor(Math.random() * size);
            idx = this.getIndexFromRC(r, c, size);
            attempts += 1;
        } while (idx === excludeIndex && attempts < maxAttempts);

        if (attempts >= maxAttempts || idx === excludeIndex) {
            for (let i = 0; i < size * size; i++) {
                if (i !== excludeIndex) return i;
            }
        }

        return idx;
    }
}
