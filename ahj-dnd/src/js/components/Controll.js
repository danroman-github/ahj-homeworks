/**
 * Класс для создания элементов управления
 * Отвечает за формы добавления карточек и кнопки
 */
export default class Controll {
    constructor(controller) {
        this.controller = controller;
    }

    /**
     * Создание CardControl для добавления карточки в колонку
     * @param {number} columnIndex - индекс колонки
     * @returns {HTMLElement} элемент управления
     */
    createAddCardControl(columnIndex) {
        const container = document.createElement("div");
        container.className = "add-card";

        const addButton = document.createElement("button");
        addButton.className = "add-card__button";
        addButton.textContent = this.controller.t.controls.addCard;

        const form = document.createElement("div");
        form.className = "add-card__form hidden";

        const textarea = document.createElement("textarea");
        textarea.className = "add-card__textarea";
        textarea.placeholder = this.controller.t.controls.addCardPlaceholder;

        const actions = document.createElement("div");
        actions.className = "add-card__actions";

        const submitBtn = document.createElement("button");
        submitBtn.className = "add-card__submit";
        submitBtn.textContent = this.controller.t.controls.addCardButton;

        const closeBtn = document.createElement("button");
        closeBtn.className = "add-card__close";
        closeBtn.innerHTML = "✕";
        closeBtn.title = this.controller.t.controls.deleteButton;

        actions.appendChild(submitBtn);
        actions.appendChild(closeBtn);
        form.appendChild(textarea);
        form.appendChild(actions);

        container.appendChild(addButton);
        container.appendChild(form);

        // Обработчики событий для формы
        addButton.addEventListener("click", () => {
            addButton.classList.add("hidden");
            form.classList.remove("hidden");
            textarea.focus();
        });

        // Закрытие формы без сохранения
        closeBtn.addEventListener("click", () => {
            form.classList.add("hidden");
            addButton.classList.remove("hidden");
            textarea.value = "";
        });

        // Добавление карточки
        submitBtn.addEventListener("click", () => {
            const text = textarea.value.trim();
            if (text) {
                this.controller.addCard(columnIndex, text);
                textarea.value = "";
                form.classList.add("hidden");
                addButton.classList.remove("hidden");
            }
        });

        // Обработка нажатия Enter в текстовом поле
        textarea.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submitBtn.click();
            }
        });

        return container;
    }
}
