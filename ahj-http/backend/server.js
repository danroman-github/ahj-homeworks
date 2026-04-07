const Koa = require('koa');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const { v4: uuidv4 } = require('uuid');

const app = new Koa(); // Создаем экземпляр приложения
const PORT = process.env.PORT || 7070; // Устанавливаем порт

// Мiddleware
app.use(cors()); // Включаем поддержку CORS
app.use(bodyParser()); // Включаем обработку тела запросов

// Создание сервера и прослушивание порта
const server = app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
}).on("error", err => {
  console.error('Error occurred:', err.message);
});
