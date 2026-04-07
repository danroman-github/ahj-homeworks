// TODO: write code here

import Controller from "./components/Controller";

const init = () => {
    const root = document.getElementById("root");
    const controller = new Controller(root);
    controller.init();
};

init();

console.log("app.js bundled");
