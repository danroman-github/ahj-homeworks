import { Controller } from "./components/Controller";

const root = document.querySelector("#root");
const controller = new Controller(root);
controller.render();
controller.start();
