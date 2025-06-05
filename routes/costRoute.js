const express = require('express');
const router = express.Router();
const logger = require("../logger/logger.js");

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
router.post('/', (req, res) => {
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
        aup = parseInt(sumpps * aupKoef);
        // Прочее
        other = parseInt(sumpps * otherKoef);
        // Налоги
        tax = parseInt(sumpps  * taxKoef);
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

module.exports = router;