export class Control {
    constructor() {
        this.boxInput = null;
        this.input = null;
        this.box = null;
        this.button = null;
    }

    createInput(placeholder = "Enter a request") {
        this.boxInput = document.createElement("div");
        this.boxInput.className = "input-box";
        this.input = document.createElement("input");
        this.input.type = "text";
        this.input.className = "input";
        this.input.placeholder = placeholder;
        this.boxInput.append(this.input);
    }

    createButton(text = "Click to toggle popover") {
        this.box = document.createElement("div");
        this.box.className = "btn-box";
        this.button = document.createElement("button");
        this.button.type = "btn";
        this.button.className = "btn";
        this.button.textContent = text;
        this.box.append(this.button);
    }

    listener(handler) {
        this.button.addEventListener("click", handler);
    }
}
