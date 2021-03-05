const express = require("express");
const { Router } = express;
const router = Router();
const passport = require("passport");

const analyticsController = require("../controllers/analytics.controller");

router.get(
  "/overview",
  passport.authenticate("jwt", { session: false }),
  analyticsController.overview
);
router.get(
  "/analytics",
  passport.authenticate("jwt", { session: false }),
  analyticsController.analytics
);

module.exports = router;
