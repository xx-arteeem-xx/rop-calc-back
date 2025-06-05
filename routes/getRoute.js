const express = require('express');
const router = express.Router();
const logger = require("../logger/logger.js");

// || МЕТОД 0. При переходе на страницу "/api/" Выдаем приветственное сообщение ||
// || Пример ответа: 
// {
//     "message": "Hello!!!"
// }
router.get('/', (req, res) => {
    try {
        let message = "Hello!!!"
        // _______________ ОТПРАВЛЯЕМ ДАННЫЕ ____________________________________
        res.status(200).json({
            message
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