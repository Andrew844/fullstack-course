const express = require("express");
const { Router } = express;
const passport = require("passport");
const multipart = require("connect-multiparty");

const upload = require("../middleware/upload.middleware");
const router = Router();
const multipartMiddleware = multipart();
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
  multipartMiddleware,
  upload.single("files"),
  categoryController.create
);
router.patch(
  "/",
  passport.authenticate("jwt", { session: false }),
  upload.single("image"),
  categoryController.update
);

module.exports = router;
