const express = require("express");
const { Router } = express;
const router = Router();
const passport = require("passport");

const orderController = require("../controllers/order.controller");

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  orderController.create
);
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  orderController.getAll
);

module.exports = router;
