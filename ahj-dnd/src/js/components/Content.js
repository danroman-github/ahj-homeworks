/**
 * Класс для создания DOM-элементов
 */
export default class Content {
    constructor(controller) {
        this.controller = controller;
    }

    createBoard() {
        const board = document.createElement("div");
        board.className = "board";

        const columnsContainer = document.createElement("div");
        columnsContainer.className = "board__columns";

        board.appendChild(columnsContainer);
        return board;
    }

    createColumnElement(column, columnIndex) {
        const columnDiv = document.createElement("div");
        columnDiv.className = "column";
        columnDiv.dataset.columnId = column.id;
        columnDiv.dataset.columnIndex = columnIndex;

        const title = document.createElement("h2");
        title.className = "column__title";
        title.textContent = column.title;

        const cardsContainer = document.createElement("div");
        cardsContainer.className = "column__cards";
        cardsContainer.dataset.columnIndex = columnIndex;
        cardsContainer.dataset.columnId = column.id;

        cardsContainer.setAttribute('aria-label', `Cards in ${column.title} column`);

        column.cards.forEach((cardText, cardIndex) => {
            const card = this.createCardElement(
                cardText,
                columnIndex,
                cardIndex,
            );
            cardsContainer.appendChild(card);
        });

        columnDiv.appendChild(title);
        columnDiv.appendChild(cardsContainer);

        return columnDiv;
    }

    createCardElement(text, columnIndex, cardIndex) {
        const card = document.createElement("div");
        card.className = "card";
        card.setAttribute("draggable", "false");
        card.dataset.columnIndex = columnIndex;
        card.dataset.cardIndex = cardIndex;
        card.dataset.cardText = text;
        card.dataset.cardId = `card-${columnIndex}-${cardIndex}-${Date.now()}`;

        const cardText = document.createElement("div");
        cardText.className = "card__text";
        cardText.textContent = text;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'card__delete';
        deleteBtn.innerHTML = this.controller.t.controls.deleteButton;
        deleteBtn.title = this.controller.t.controls.deleteButton;
        deleteBtn.setAttribute('aria-label', 'Delete card');

        card.appendChild(cardText);
        card.appendChild(deleteBtn);

        return card;
    }
}
