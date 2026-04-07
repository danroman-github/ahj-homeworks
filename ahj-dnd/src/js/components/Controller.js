import Content from "./Content";
import Controll from "./Controll";
import LanguageSwitcher from "./LanguageSwitcher";
import translations from "./Translations";

/**
 * Класс Controller
 * Управляет состоянием, обрабатывает события Drag & Drop
 */
export default class Controller {
    constructor(root) {
        this.root = root;
        this.currentLang = localStorage.getItem("trelloLanguage") || "en";
        this.t = translations[this.currentLang];

        /**
         * Структура данных доски
         * columns - массив колонок с фиксированными ID и названиями
         * cards - массив текстов карточек в каждой колонке
         */
        this.columns = [
            { id: "todo", title: this.t.columns.todo, cards: [] },
            { id: "in-progress", title: this.t.columns.inProgress, cards: [] },
            { id: "done", title: this.t.columns.done, cards: [] },
        ];

        this.isDragging = false;
        this.draggedCard = null;
        this.draggedElement = null;
        this.dragClone = null;
        this.dragOffset = { x: 0, y: 0 };
        this.placeholder = null;
        this.sourceColumnIndex = null;
        this.sourceCardIndex = null;
        this.draggedCardHeight = 0;

        this.content = new Content(this);
        this.controll = new Controll(this);
        this.languageSwitcher = new LanguageSwitcher(this);

        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);

        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleDocumentDragStart = this.handleDocumentDragStart.bind(this);
        this.handleDocumentDragOver = this.handleDocumentDragOver.bind(this);
        this.handleDocumentDrop = this.handleDocumentDrop.bind(this);
    }

    init() {
        this.loadFromStorage();
        this.render();
        this.initEventListeners();
    }

    /**
     * Установка языка
     * @param {string} lang - код языка ('en' или 'ru')
     */
    setLanguage(lang) {
        this.currentLang = lang;
        this.t = translations[lang];

        this.columns[0].title = this.t.columns.todo;
        this.columns[1].title = this.t.columns.inProgress;
        this.columns[2].title = this.t.columns.done;

        localStorage.setItem("trelloLanguage", lang);
    }

    // Загрузка состояния из localStorage
    loadFromStorage() {
        const saved = localStorage.getItem("trelloBoard");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.columns) {
                    this.columns[0].cards = parsed.columns[0]?.cards || [];
                    this.columns[1].cards = parsed.columns[1]?.cards || [];
                    this.columns[2].cards = parsed.columns[2]?.cards || [];
                }
            } catch (e) {
                console.error("Failed to load from storage", e);
            }
        }
    }

    // Сохранение состояния в localStorage
    saveToStorage() {
        localStorage.setItem(
            "trelloBoard",
            JSON.stringify({
                columns: this.columns.map((col) => ({
                    id: col.id,
                    cards: col.cards,
                })),
            }),
        );
    }

    render() {
        this.root.innerHTML = "";

        const topBar = document.createElement("div");
        topBar.className = "top-bar";
        topBar.appendChild(this.languageSwitcher.createSwitcher());
        this.root.appendChild(topBar);

        const boardElement = this.content.createBoard();
        this.root.appendChild(boardElement);

        this.columns.forEach((column, columnIndex) => {
            const columnElement = this.content.createColumnElement(
                column,
                columnIndex,
            );
            boardElement
                .querySelector(".board__columns")
                .appendChild(columnElement);

            const addCardControl =
                this.controll.createAddCardControl(columnIndex);
            columnElement.appendChild(addCardControl);
        });

        this.initDelegatedEventListeners();
    }

    // Инициализация обработчиков событий
    initDelegatedEventListeners() {
        document.querySelectorAll('.column__cards').forEach(container => {

            container.addEventListener('dragstart', (e) => e.preventDefault());
            container.addEventListener('dragover', this.handleDocumentDragOver);
            container.addEventListener('drop', this.handleDocumentDrop);
        });

        document.querySelectorAll('.column').forEach(column => {
            column.addEventListener('click', this.handleCardDelete.bind(this));
            column.addEventListener('mousedown', this.handleCardDragStart.bind(this));
        });
    }

    /**
     * Обработчик нажатия мыши на карточку
     * @param {MouseEvent} e - событие мыши
     */
    handleCardDragStart(e) {
        const card = e.target.closest('.card');
        if (!card) return;

        if (e.target.closest('.card__delete')) return;

        this.sourceColumnIndex = parseInt(card.dataset.columnIndex);
        this.sourceCardIndex = parseInt(card.dataset.cardIndex);
        this.draggedCard = {
            columnIndex: this.sourceColumnIndex,
            cardIndex: this.sourceCardIndex,
            text: card.dataset.cardText
        };

        const rect = card.getBoundingClientRect();
        this.draggedCardHeight = rect.height;

        this.dragOffset = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };

        this.dragClone = card.cloneNode(true);
        this.dragClone.classList.add('drag-clone');
        this.dragClone.style.position = 'fixed';
        this.dragClone.style.left = (e.clientX - this.dragOffset.x) + 'px';
        this.dragClone.style.top = (e.clientY - this.dragOffset.y) + 'px';
        this.dragClone.style.width = rect.width + 'px';
        this.dragClone.style.height = rect.height + 'px';
        this.dragClone.style.pointerEvents = 'none';
        this.dragClone.style.zIndex = '9999';
        this.dragClone.style.cursor = 'grabbing';

        const deleteBtn = this.dragClone.querySelector('.card__delete');
        if (deleteBtn) deleteBtn.style.display = 'none';

        document.body.appendChild(this.dragClone);

        this.placeholder = document.createElement('div');
        this.placeholder.className = 'placeholder';
        this.placeholder.style.height = this.draggedCardHeight + 'px';

        card.classList.add("dragging");

        this.isDragging = true;
        document.body.classList.add('dragging-active');

        document.addEventListener('mousemove', this.handleMouseMove);
        document.addEventListener('mouseup', this.handleMouseUp);

        e.preventDefault();
    }

    /**
     * Обработчик удаления карточки (делегированный)
     * @param {MouseEvent} e 
     */
    handleCardDelete(e) {
        const deleteBtn = e.target.closest('.card__delete');
        if (!deleteBtn) return;

        const card = deleteBtn.closest('.card');
        if (!card) return;

        const columnIndex = parseInt(card.dataset.columnIndex);
        const cardIndex = parseInt(card.dataset.cardIndex);

        if (confirm(this.t.messages.confirmDelete)) {
            this.deleteCard(columnIndex, cardIndex);
        }
    }

    /**
     * Обработчик движения мыши
     * @param {MouseEvent} e
     */
    handleMouseMove(e) {
        if (!this.isDragging || !this.dragClone) return;

        this.dragClone.style.left = (e.clientX - this.dragOffset.x) + 'px';
        this.dragClone.style.top = (e.clientY - this.dragOffset.y) + 'px';

        const elementsUnderCursor = document.elementsFromPoint(e.clientX, e.clientY);
        const columnContainer = elementsUnderCursor.find(el =>
            el.classList.contains('column__cards')
        );

        document.querySelectorAll('.column__cards').forEach(col => {
            col.classList.remove('column__cards--dragover');
        });

        if (columnContainer) {
            columnContainer.classList.add('column__cards--dragover');
            this.updatePlaceholderPosition(columnContainer, e.clientY);
        } else {
            this.removePlaceholder();
        }
    }

    /**
     * Обновление позиции Placeholder
     * @param {HTMLElement} container - контейнер колонки
     * @param {number} mouseY - координата Y курсора
     */
    updatePlaceholderPosition(container, mouseY) {
        const cards = Array.from(
            container.querySelectorAll(".card:not(.dragging)")
        );

        this.removePlaceholder();

        if (cards.length === 0) {
            container.appendChild(this.placeholder);
            return;
        }

        let insertBefore = null;

        for (const card of cards) {
            const rect = card.getBoundingClientRect();
            const cardMiddle = rect.top + rect.height / 2;

            if (mouseY < cardMiddle) {
                insertBefore = card;
                break;
            }
        }

        if (insertBefore) {
            container.insertBefore(this.placeholder, insertBefore);
        } else {
            container.appendChild(this.placeholder);
        }
    }

    /**
     * Обработчик отпускания мыши
     * @param {MouseEvent} e
     */
    handleMouseUp(e) {
        if (!this.isDragging) return;

        if (this.dragClone) {
            document.body.removeChild(this.dragClone);
            this.dragClone = null;
        }

        const elementsUnderCursor = document.elementsFromPoint(e.clientX, e.clientY);
        const targetContainer = elementsUnderCursor.find(el =>
            el.classList.contains('column__cards')
        );

        if (targetContainer && this.draggedCard) {
            const targetColumnIndex = parseInt(targetContainer.dataset.columnIndex);

            let dropIndex = this.columns[targetColumnIndex].cards.length;

            if (this.placeholder && this.placeholder.parentNode === targetContainer) {
                const cards = Array.from(
                    targetContainer.querySelectorAll('.card:not(.dragging)')
                );

                for (let i = 0; i < cards.length; i++) {
                    if (cards[i] === this.placeholder.nextSibling) {
                        dropIndex = i;
                        break;
                    }
                }
            }

            const [movedCard] = this.columns[this.sourceColumnIndex]
                .cards.splice(this.sourceCardIndex, 1);
            this.columns[targetColumnIndex].cards.splice(dropIndex, 0, movedCard);

            this.saveToStorage();
        }

        this.cleanupDragUI();
        this.render();
    }

    // Очистка UI после перетаскивания
    cleanupDragUI() {
        document.querySelectorAll('.column__cards').forEach(col => {
            col.classList.remove('column__cards--dragover');
        });

        this.removePlaceholder();

        document.querySelectorAll('.card.dragging').forEach(card => {
            card.classList.remove('dragging');
        });

        this.isDragging = false;
        this.draggedCard = null;
        this.draggedElement = null;
        this.sourceColumnIndex = null;
        this.sourceCardIndex = null;
        this.draggedCardHeight = 0;

        document.body.classList.remove('dragging-active');
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mouseup', this.handleMouseUp);
    }

    // Удаление Placeholder
    removePlaceholder() {
        if (this.placeholder && this.placeholder.parentNode) {
            this.placeholder.parentNode.removeChild(this.placeholder);
        }
    }

    // Обработчик dragstart на документе
    handleDocumentDragStart(e) {
        e.preventDefault();
    }

    // Обработчик dragover на документе
    handleDocumentDragOver(e) {
        e.preventDefault();
    }

    // Обработчик drop на документе
    handleDocumentDrop(e) {
        e.preventDefault();
    }

    /**
     * Добавление новой карточки
     * @param {number} columnIndex - индекс колонки
     * @param {string} text - текст карточки
     */
    addCard(columnIndex, text) {
        if (text.trim()) {
            this.columns[columnIndex].cards.push(text);
            this.saveToStorage();
            this.render();
        }
    }

    /**
     * Удаление карточки
     * @param {number} columnIndex - индекс колонки
     * @param {number} cardIndex - индекс карточки
     */
    deleteCard(columnIndex, cardIndex) {
        this.columns[columnIndex].cards.splice(cardIndex, 1);
        this.saveToStorage();
        this.render();
    }

    // Глобальные обработчики событий
    initEventListeners() {
        document.addEventListener('dragstart', this.handleDocumentDragStart);
        document.addEventListener('dragover', this.handleDocumentDragOver);
        document.addEventListener('drop', this.handleDocumentDrop);
    }
}
