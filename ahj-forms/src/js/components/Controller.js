import { Control } from "./Control";
import { Content } from "./Content";

export class Controller {
    constructor(container) {
        this.container = container;
        this.control = null;
        this.content = null;
        this.button = null;
    }

    render() {
        this.control = new Control();
        this.control.createInput();
        this.container.append(this.control.boxInput);

        this.control.createButton();
        this.container.append(this.control.box);

        this.content = new Content();
        this.content.render();

        this.button = this.control.box;

        this.content.box.style.position = "absolute";
        this.content.box.style.display = "none";

        this.container.append(this.content.box);
    }

    start() {
        this.control.listener(this.btnClick.bind(this));
        document.addEventListener("click", this.outsideClick.bind(this));
    }

    btnClick(event) {
        event.preventDefault();

        if (this.checkContent()) {
            this.content.box.style.display = "none";
        } else {
            this.position();
            this.content.box.style.display = "block";
        }
    }

    outsideClick(event) {
        if (!this.button.contains(event.target)) {
            this.content.box.style.display = "none";
        }
    }

    checkContent() {
        return this.content.box.style.display === "block";
    }

    position() {
        if (!this.button || !this.content) return;

        const buttonRect = this.button.getBoundingClientRect();
        const containerRect = this.container.getBoundingClientRect();

        const wasHidden = this.container.style.display === "none";
        if (wasHidden) {
            this.container.style.display = "block";
        }

        const popoverRect = this.container.getBoundingClientRect();
        const popoverWidth = popoverRect.width || this.container.offsetWidth;
        const popoverHeight = popoverRect.height || this.container.offsetHeight;

        const buttonCenterX = buttonRect.left + buttonRect.width / 2;
        let left = buttonCenterX - popoverWidth / 2;

        const minLeft = containerRect.left;
        const maxLeft = containerRect.right - popoverWidth;

        if (left < minLeft) {
            left = minLeft;
        } else if (left > maxLeft) {
            left = maxLeft;
        }

        let top = buttonRect.top - popoverHeight + 190;
        console.log(buttonRect.top, popoverHeight);

        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollLeft =
            window.scrollX || document.documentElement.scrollLeft;

        this.content.box.style.top = `${top + scrollTop}px`;
        this.content.box.style.left = `${left + scrollLeft}px`;
    }
}
