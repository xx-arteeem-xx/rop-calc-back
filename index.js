// _____________________ ИМПОРТ БИБЛИОТЕК ______________________________________
const express = require('express');
require('dotenv').config();
const pgp = require("pg-promise")();
const logger = require("./logger/logger.js");


// ______________ НАСТРОЙКА ПАРАМЕТРОВ ПРИЛОЖЕНИЯ ______________________________
const dbPath = `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
const db = pgp(dbPath);
const app = express();
app.use(express.json());
const port = 3000;


// ________________________ МЕТОДЫ ____________________________________________

// || МЕТОД 1. При переходе на страницу "/api/calc/income/" Подсчет количества доходов направления ||
// || Пример тела запроса: 
// {
//     "data": [
//         {
//             "cash": [144718, 144718, 144718, 144718],
//             "students": [0, 0, 14, 21]
//         },
//         {
//             "cash": [136200, 136200, 135900, 141600],
//             "students": [18, 65, 41, 12]
//         }
//     ]
// }
// 
// || Пример ответа: 
// {
//     "budget": 5065130,
//     "commerce": 18575700,
//     "sum": 23640830
// }
app.post('/api/calc/income/', (req, res) => {
    try {
        // _______________ ЗАДАЕМ ПЕРЕМЕННЫЕ __________________________________
        let budget = 0;
        let commerce = 0;
        let sum = 0;
        let cash1 = req.body.data[0].cash;
        let cash2 = req.body.data[1].cash;
        let students1 = req.body.data[0].students;
        let students2 = req.body.data[1].students;

        // _______________ ПРОВЕРЯЕМ НА ОШИБКИ В ДАННЫХ ________________________
        if ((cash1.length != students1.length) || (cash2.length != students2.length)){
            throw new Error("Count of students and cash must be equal!");
        }

        // _______________ ПРОВОДИМ РАССЧЕТЫ ___________________________________
        for (let i = 0; i < cash1.length; i++) {
            budget += cash1[i] * students1[i]
        };
        for (let i = 0; i < cash2.length; i++) {
            commerce += cash2[i] * students2[i]
        };
        sum = budget + commerce;

        // _______________ ОТПРАВЛЯЕМ ДАННЫЕ ____________________________________
        res.status(200).json({
            budget,
            commerce,
            sum
        });
        logger.info({
            "path": req.path,
            "ip": req.ip
        });
    } catch (error) {
        // _______________ ЕСЛИ НАШЛИ ОШИБКУ ____________________________________
        res.status(400).json({
            "error": error.message
        });
        logger.error({
            "error": error.message,
            "path": req.path,
            "ip": req.ip
        });
    }
});


// _____________________ ЗАПУСК ПРИЛОЖЕНИЯ _____________________________________
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});