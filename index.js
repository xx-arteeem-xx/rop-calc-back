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

// || МЕТОД 1. При переходе на страницу "/api/calc/income/" Подсчет доходов направления ||
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

// || МЕТОД 2. При переходе на страницу "/api/calc/cost/" Подсчет расходов направления ||
// || Пример тела запроса: 
// {
//     "cash": 925,
//     "flowKoef": 2,
//     "subgroupKoef": 2,
//     "aupKoef": 0.430,
//     "otherKoef": 0.430,
//     "taxKoef": 0.302,
//     "groupCount": [1, 4, 4, 2],
//     "students": [18, 65, 55, 21],
//     "group": [514, 519, 528, 379],
//     "flow": [420, 360, 396, 442],
//     "subgroup": [144, 160, 72, 144],
//     "ind": [22.79, 26.05, 27.55, 43.84]
// }
// 
// || Пример ответа: 
// {
//     "group": 5050500,
//     "flow": 2001700,
//     "subgroup": 2516000,
//     "ind": 4198908,
//     "sumpps": 13767108,
//     "aup": 5919856.4399999995,
//     "other": 5919856.4399999995,
//     "tax": 4157666.616,
//     "sum": 29764487.495999996
// }
app.post('/api/calc/cost/', (req, res) => {
    try {
        // _______________ ЗАДАЕМ ПЕРЕМЕННЫЕ __________________________________
        let group = 0;
        let flow = 0;
        let subgroup = 0;
        let ind = 0;
        let sumpps = 0;
        let aup = 0;
        let other = 0;
        let tax = 0;
        let sum = 0;

        let cashPerHour = req.body.cash;
        let flowKoef = req.body.flowKoef;
        let subgroupKoef = req.body.subgroupKoef;
        let aupKoef = req.body.aupKoef;
        let otherKoef = req.body.otherKoef;
        let taxKoef = req.body.taxKoef;

        let dataGroupCount = req.body.groupCount;
        let dataStudentsAll = req.body.students;
        let dataGroup = req.body.group;
        let dataFlow = req.body.flow;
        let dataSubgroup = req.body.subgroup;
        let dataInd = req.body.ind;
        
        // _______________ ПРОВЕРЯЕМ НА ОШИБКИ В ДАННЫХ ________________________

        // _______________ ПРОВОДИМ РАССЧЕТЫ ___________________________________
        // Групповая
        for (let i = 0; i < dataGroupCount.length; i++) {
            group += dataGroupCount[i] * dataGroup[i]
        };
        group = group * cashPerHour;
        // Поточная
        for (let i = 0; i < dataGroupCount.length; i++) {
            flow += dataGroupCount[i] * dataFlow[i]
        };
        flow = flow * cashPerHour / flowKoef;
        // По подгруппам
        for (let i = 0; i < dataGroupCount.length; i++) {
            subgroup += dataGroupCount[i] * dataSubgroup[i]
        };
        subgroup = subgroup * cashPerHour * subgroupKoef;
        // Индивидуальная
        for (let i = 0; i < dataStudentsAll.length; i++) {
            ind += dataStudentsAll[i] * dataInd[i]
        };
        ind = ind * cashPerHour;
        // Итого ППС
        sumpps = group + flow + subgroup + ind;
        // АУП
        aup = sumpps * aupKoef;
        // Прочее
        other = sumpps * otherKoef;
        // Налоги
        tax = sumpps  * taxKoef;
        // Общие расходы
        sum = sumpps + aup + other + tax;

        // _______________ ОТПРАВЛЯЕМ ДАННЫЕ ____________________________________
        res.status(200).json({
            group,
            flow,
            subgroup,
            ind,
            sumpps,
            aup,
            other,
            tax,
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