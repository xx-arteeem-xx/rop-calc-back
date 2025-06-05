const express = require('express');
const router = express.Router();
const logger = require("../logger/logger.js");

// || МЕТОД 3. При переходе на страницу "/api/calc/finres/" Подсчет финансового результата направления ||
// || Пример тела запроса: 
// {
//     "income": 29622405,
//     "cost": 29764490,
//     "groupCount": 11,
//     "studentCount": 171
// }
// 
// || Пример ответа: 
// {
//     "finres": -142085,
//     "efficiency": -0.004773641342418422,
//     "oneGroup": -12916.818181818182,
//     "oneStudent": -830.906432748538
// }
router.post('/', (req, res) => {
    try {
        // _______________ ЗАДАЕМ ПЕРЕМЕННЫЕ __________________________________
        let finres = 0;
        let efficiency = 0;
        let oneGroup = 0;
        let oneStudent = 0;
        let income = req.body.income;
        let cost = req.body.cost;
        let studentCount = req.body.studentCount;
        let groupCount = req.body.groupCount;

        // _______________ ПРОВЕРЯЕМ НА ОШИБКИ В ДАННЫХ ________________________

        // _______________ ПРОВОДИМ РАССЧЕТЫ ___________________________________
        // Финансовый результат
        finres = income - cost;
        // Рентабельность
        efficiency = -1 + (income / cost);
        // На одну группу
        oneGroup = parseInt(finres / groupCount);
        // На одного студента
        oneStudent = parseInt(finres / studentCount);

        // _______________ ОТПРАВЛЯЕМ ДАННЫЕ ____________________________________
        res.status(200).json({
            finres,
            efficiency,
            oneGroup,
            oneStudent
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

module.exports = router;