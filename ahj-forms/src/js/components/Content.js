export class Content {
    constructor() {
        this.box = null;
    }

    render() {
        const text =
            "And here's some amazing content. It's very engaging. Right?";

        this.box = document.createElement("div");
        this.box.className = "popover";
        this.box.innerHTML = `
            <div class="popover-arrow"></div>
            <div class="popover-header">Popover title</div>
            <div class="popover-body">${text}</div>
        `;
    }
}
