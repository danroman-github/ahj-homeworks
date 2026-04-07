import './css/style.css';
import App from './js/app.js';

document.addEventListener('DOMContentLoaded', () => {
    const appRoot = document.querySelector('.game-field');
    new App(appRoot, 4);
});