const express = require("express");
const { Router } = express;
const passport = require("passport");

const upload = require("../middleware/upload.middleware");
const router = Router();
const categoryController = require("../controllers/category.controller");

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  categoryController.getAll
);
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  categoryController.getById
);
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  categoryController.remove
);
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  upload.single("image"),
  categoryController.create
);
router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  upload.single("image"),
  categoryController.update
);

module.exports = router;
