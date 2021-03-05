const express = require("express");
const { Router } = express;
const router = Router();
const passport = require("passport");

const positionController = require("../controllers/position.controller");

router.get(
  "/:categoryId",
  passport.authenticate("jwt", { session: false }),
  positionController.getByCategoryId
);
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  positionController.create
);
router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  positionController.update
);
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  positionController.remove
);

module.exports = router;
