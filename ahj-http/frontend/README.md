# Задание «Работа с HTTP»

## HelpDesk

### Легенда

Пока backend-разработчик находится в отпуске, вам поручили сделать прототип API для сервиса управления заявками на помощь (можете за себя порадоваться, так недалеко и до fullstack'а), к которому вам и нужно будет в дальнейшем прикруить frontend.

### Описание

Вам потребуется написать [CRUD](https://ru.wikipedia.org/wiki/CRUD) функционал для работы с заявками при помощи сервера koa. Для хранения данных мы будем оперировать следующими структурами:

```
Ticket {
    id // идентификатор (уникальный в пределах системы)
    name // краткое описание
    status // boolean - сделано или нет
    created // дата создания (timestamp)
}

TicketFull {
    id // идентификатор (уникальный в пределах системы)
    name // краткое описание
    description // полное описание
    status // boolean - сделано или нет
    created // дата создания (timestamp)
}
```

Примеры запросов:

- GET ?method=allTickets - список тикетов
- GET ?method=ticketById&id=<id> - полное описание тикета (где <id> - идентификатор тикета)
- POST ?method=createTicket - создание тикета (<id> генерируется на сервере, в теле формы name, description, status)

Соответственно:

- GET ?method=allTickets - массив объектов типа Ticket (т.е. без description)
- GET ?method=ticketById&id=<id> - объект типа TicketFull (т.е. с description)
- POST ?method=createTicket - в теле запроса форма с полями для объекта типа Ticket (с id = null)

Авто-тесты писать не нужно.

Не забывайте про [CORS](https://developer.mozilla.org/ru/docs/Web/HTTP/Guides/CORS). Для обработки CORS в koa есть своя middleware [koa-CORS](https://github.com/koajs/cors)

Для упрощения тестирования можете при старте сервера добавлять туда несколько тикетов.

Для начала, чтобы с сервера отдавать данные, достаточно в обработчиках koa написать:

```
const tickets = [];

app.use(async ctx => {
    const { method } = ctx.request.querystring;

    switch (method) {
        case 'allTickets':
            ctx.response.body = tickets;
            return;
        // TODO: обработка остальных методов
        default:
            ctx.response.status = 404;
            return;
    }
});
```

А код ниже позволит обработать полученный ответ от сервера во Frontend:

```
xhr.addEventListener('load', () => {
    if (xhr.status >= 200 && xhr.status < 300) {
        try {
            const data = JSON.parse(xhr.responseText);
        } catch (e) {
            console.error(e);
        }
    }
});
```

## HelpDesk: Frontend

### Легенда

Часть API вами написано, пора приступить к своим прямым обязанностям - написанию фронтенда, который будет с этим API работать.

### Описание

Общий вид списка тикетов (должны загружаться с сервера в формате JSON):

![](https://github.com/danroman-github/ahj-http/blob/main/src/img/helpdesk.png)

Модальное окно добавления нового тикета (вызывается по кнопке "Добавить тикет" в правом верхнем углу):

![](https://github.com/danroman-github/ahj-http/blob/main/src/img/helpdesk-2.png)

Модальное окно редактирования существующего тикета (вызвается по кнопке с иконкой "✎" - карандашик):

![](https://github.com/danroman-github/ahj-http/blob/main/src/img/helpdesk-3.png)

Модальное окно подтверждения удаления (вызывается по кнопке с иконкой "x" - крестик):

![](https://github.com/danroman-github/ahj-http/blob/main/src/img/helpdesk-4.png)

Для просмотра деталей тикета нужно нажать на тело тикета (но не на кнопки - "сделано", "редактировать" или "удалить"):

![](https://github.com/danroman-github/ahj-http/blob/main/src/img/helpdesk-5.png)

Ваше приложение должно реализовывать следующий функционал:

- Отображение всех тикетов
- Создание нового тикета
- Удаление тикета
- Изменение тикета
- Получение подробного описание тикета
- Отметка о выполнении каждого тикета

Весь этот функционал должен быть связан с сервером через методы. Например для удаления нужно отправить запрос с соответствующим методом, получить подтверждение и подтянуть обновлённый список тасков.

В качестве бонуса можете отображать какую-нибудь иконку загрузки (см. [https://loading.io](https://loading.io)) на время подгрузки.

Авто-тесты к данной задаче не требуются. Все данные и изменения должны браться/сохраняться на сервере, который вы написали в предыдущей задаче.

Для получения данных с сервера вы можете использовать [XMLHttpRequest](https://developer.mozilla.org/ru/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest) или [fetch API](https://developer.mozilla.org/ru/docs/Web/API/Fetch_API/Using_Fetch). Мы рекомендуем в fetch, но выбор остаётся за вами.

[![ahj-dnd](https://github.com/danroman-github/ahj-dnd/actions/workflows/web.yml/badge.svg)](https://github.com/danroman-github/ahj-dnd/actions/workflows/web.yml)
