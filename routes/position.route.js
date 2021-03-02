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
router.post("/", positionController.create);
router.patch("/:id", positionController.update);
router.delete("/:id", positionController.remove);

module.exports = router;
