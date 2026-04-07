/**
 * @jest-environment jsdom
 */

import { Controller } from "./components/Controller";

describe("Пример теста jsdom", () => {
    beforeAll(() => {
        document.body.innerHTML = `<div id="root"></div>`;
        const root = document.querySelector("#root");
        const controller = new Controller(root);
        controller.render();
        controller.start();
    });

    test("Элемент есть на странице, виден", () => {
        const input = document.querySelector("button");
        input.click();
        const box = document.querySelector(".popover");
        expect(box.style.display).toBe("block");
    });

    test("Элемент есть на странице, скрыт", () => {
        const input = document.querySelector("button");
        input.click();
        const box = document.querySelector(".popover");
        expect(box.style.display).toBe('none');
    });

    test("Элемента нет на странице", () => {
        const input = document.querySelector("button");
        input.click();
        const box = document.querySelector(".content-box");
        expect(box).toBeNull();
    });
});