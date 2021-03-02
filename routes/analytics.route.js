const express = require("express");
const { Router } = express;
const router = Router();
const analyticsController = require("../controllers/analytics.controller");

router.get("/overview", analyticsController.overview);
router.get("/analytics", analyticsController.analytics);

module.exports = router;
