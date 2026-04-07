// TODO: write code here

const subscribeWidget = document.querySelector('[data-widget=subscribe]');
const subscribeForm = subscribeWidget.querySelector('[data-id=subscribe-form]');
const nameInput = subscribeWidget.querySelector('[data-id=name]');
const phoneInput = subscribeWidget.querySelector('[data-id=phone]');

// subscribeForm.addEventListener('submit', (evt) => {
//   evt.preventDefault();
// });

POST()
subscribeForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const params = new URLSearchParams();
    Array.from(subscribeForm.elements)
        .filter(({ name }) => name)
        .forEach(({ name, value }) => params.append(name, value));
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:7070');
    xhr.send(params);
});
// dusty +71223445678