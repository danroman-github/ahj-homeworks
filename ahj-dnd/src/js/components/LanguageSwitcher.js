/**
 * Класс переключателя языка
 * Позволяет пользователю переключаться между английским и русским языками
 */
export default class LanguageSwitcher {
    constructor(controller) {
        this.controller = controller;
        this.currentLang = localStorage.getItem("trelloLanguage") || "en";
    }

    /**
     * Создание элемента переключателя языка
     * @returns {HTMLElement} элемент переключателя
     */
    createSwitcher() {
        const container = document.createElement("div");
        container.className = "language-switcher";

        const label = document.createElement("span");
        label.className = "language-switcher__label";
        label.textContent = this.controller.t.labels.language + ":";

        const buttonsContainer = document.createElement("div");
        buttonsContainer.className = "language-switcher__buttons";

        const enBtn = document.createElement("button");
        enBtn.className = `language-switcher__btn ${this.currentLang === "en" ? "active" : ""}`;
        enBtn.textContent = "English";
        enBtn.dataset.lang = "en";
        enBtn.addEventListener("click", () => this.switchLanguage("en"));

        const ruBtn = document.createElement("button");
        ruBtn.className = `language-switcher__btn ${this.currentLang === "ru" ? "active" : ""}`;
        ruBtn.textContent = "Русский";
        ruBtn.dataset.lang = "ru";
        ruBtn.addEventListener("click", () => this.switchLanguage("ru"));

        buttonsContainer.appendChild(enBtn);
        buttonsContainer.appendChild(ruBtn);

        container.appendChild(label);
        container.appendChild(buttonsContainer);

        return container;
    }

    /**
     * Переключение языка
     * @param {string} lang - код языка ('en' или 'ru')
     */
    switchLanguage(lang) {
        if (lang === this.currentLang) return;

        this.currentLang = lang;
        localStorage.setItem("trelloLanguage", lang);

        document.querySelectorAll(".language-switcher__btn").forEach((btn) => {
            if (btn.dataset.lang === lang) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });

        this.controller.setLanguage(lang);
        this.controller.render();
    }

    update() {
        this.currentLang = this.controller.currentLang;

        const buttons = document.querySelectorAll(".language-switcher__btn");
        buttons.forEach((btn) => {
            if (btn.dataset.lang === this.currentLang) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });
    }
}
