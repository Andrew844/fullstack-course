const express = require("express");
const { Router } = express;
const router = Router();
const orderController = require("../controllers/order.controller");

router.post("/", orderController.create);
router.get("/", orderController.getAll);

module.exports = router;
