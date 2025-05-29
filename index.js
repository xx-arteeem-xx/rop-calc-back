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

// || МЕТОД 1. При переходе на страницу "/api/getusers" получение списка всех пользователей. ||
app.get('/api/getusers/', (req, res) => {
    db.any("SELECT * FROM users")
        .then(function (data) {
            res.json(data);
            logger.info({
                "path": req.path,
                "ip": req.ip
            });
        })
        .catch(function (error) {
            res.json({ error });
            logger.error({
                "error": error.name,
                "path": req.path,
                "ip": req.ip
            });
        });
});

// || МЕТОД 2. При переходе на страницу "/api/getusers/${id}" получение пользователя по ID. ||
app.get('/api/getusers/:id', (req, res) => {
    db.one(`SELECT * FROM users WHERE id=${req.params.id}`)
        .then(function (data) {
            res.json(data);
            logger.info({
                "path": req.path,
                "ip": req.ip
            });
        })
        .catch(function (error) {
            res.json({ error });
            logger.error({
                "error": error.name,
                "path": req.path,
                "ip": req.ip
            });
        });
});

// || МЕТОД 3. При переходе на страницу "/api/calc/income/" Подсчет количества денег, которые приносят студенты. ||
// || Необходимо передать 2 массива: cash - в котором указать стоимость курса, и массив students - в нем количество учащихся на каждом курсе||
app.post('/api/calc/income/', (req, res) => {
    if (!req.body) {
        return response.sendStatus(400);
    };
    try {
        let result = 0;
        if (req.body.cash.length != req.body.students.length){
            throw new Error("Количество элементов этих массивов должно совпадать!");
        }
        for (let i = 0; i < req.body.cash.length; i++) {
            result += req.body.cash[i] * req.body.students[i]
        };
        res.json(result);
        logger.info({
            "path": req.path,
            "ip": req.ip
        });
    } catch (error) {
        res.status(500).json({ error });
        logger.error({
            "error": error.name,
            "path": req.path,
            "ip": req.ip
        });
    }
});


// _____________________ ЗАПУСК ПРИЛОЖЕНИЯ _____________________________________
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});