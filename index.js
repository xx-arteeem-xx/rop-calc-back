// _____________________ ИМПОРТ БИБЛИОТЕК ______________________________________
const express = require('express');
require('dotenv').config();
const pgp = require("pg-promise")();


// ______________ НАСТРОЙКА ПАРАМЕТРОВ ПРИЛОЖЕНИЯ ______________________________
const dbPath = `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
const db = pgp(dbPath);
const app = express();
const port = 3000;


// ________________________ МЕТОДЫ ____________________________________________

// МЕТОД 1. При переходе на страницу "/api/getusers" получение списка всех пользователей.
app.get('/api/getusers/', (req, res) => {
    db.any("SELECT * FROM users")
        .then(function (data) {
            res.json(data);
        })
        .catch(function (error) {
            res.json({ error });
        });
});

// МЕТОД 2. При переходе на страницу "/api/getusers/${id}" получение пользователя по ID.
app.get('/api/getusers/:id', (req, res) => {
    db.one(`SELECT * FROM users WHERE id=${req.params.id}`)
        .then(function (data) {
            res.json(data);
        })
        .catch(function (error) {
            res.json({ error });
        });
});


// _____________________ ЗАПУСК ПРИЛОЖЕНИЯ _____________________________________
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
