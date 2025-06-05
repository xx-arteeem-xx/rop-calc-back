// _____________________ ИМПОРТ БИБЛИОТЕК ______________________________________
const express = require('express');
require('dotenv').config();
const pgp = require("pg-promise")();
const cors = require("cors");

// _____________________ ИМПОРТ ПУТЕЙ _________________________________________
const getRoute = require('./routes/getRoute.js');
const incomeRoute = require('./routes/incomeRoute.js');
const costRoute = require('./routes/costRoute.js');
const finresRoute = require('./routes/finresRoute.js');
const calcRoute = require('./routes/calcRoute.js');

// ______________ НАСТРОЙКА ПАРАМЕТРОВ ПРИЛОЖЕНИЯ ______________________________
const dbPath = `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
const db = pgp(dbPath);
const app = express();
app.use(express.json());
const port = 3000;
const corsOptions ={
    origin: '*', 
    credentials: true,
    optionSuccessStatus: 200,
};
app.use(cors(corsOptions));


// ________________________ МЕТОДЫ ____________________________________________
app.use('/api', getRoute);
app.use('/api/calc/income/', incomeRoute);
app.use('/api/calc/cost/', costRoute);
app.use('/api/calc/finres/', finresRoute);
app.use('/api/calc/', calcRoute);

// _____________________ ЗАПУСК ПРИЛОЖЕНИЯ _____________________________________
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});