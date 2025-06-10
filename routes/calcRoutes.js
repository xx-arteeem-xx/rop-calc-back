const express = require('express');
const router = express.Router();
const controller = require("../controllers/calcController.js");
const roleMiddleware = require("../middlewares/roleMiddleware.js");

router.get("/", roleMiddleware(["ADMIN"]), controller.get);
router.post("/income", roleMiddleware(["ADMIN"]), controller.income);
router.post("/cost", roleMiddleware(["ADMIN"]), controller.cost);
router.post("/finres", roleMiddleware(["ADMIN"]), controller.finres);
router.post("/", roleMiddleware(["ADMIN"]), controller.calc);

module.exports = router;