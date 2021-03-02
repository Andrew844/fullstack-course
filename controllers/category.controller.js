const multiparty = require("multiparty");

const Category = require("../models/Category.model");
const Position = require("../models/Position.model");
const { errorHandler } = require("../utils/errorHandler.util");

module.exports.getAll = function (req, res) {
  try {
    Category.find({ user: req.user.id }).then(
      (categories) => {
        res.status(200).json(categories);
      },
      (e) => errorHandler(res, e)
    );
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.getById = function (req, res) {
  try {
    Category.findById(req.params.id).then(
      (category) => {
        res.status(200).json(category);
      },
      (e) => errorHandler(res, e)
    );
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.remove = function (req, res) {
  try {
    Category.remove({ _id: req.params.id }).then(
      () => {
        Position.remove({ category: req.params.id }).then(
          () => {
            res.status(200).json({ message: "Категория удалена." });
          },
          (e) => errorHandler(res, e)
        );
      },
      (e) => {
        errorHandler(res, e);
      }
    );
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.create = async function (req, res) {
  try {
    const form = new multiparty.Form({ uploadDir: "../uploads" });

    console.log("req.files: ", req.files);
    console.log("req.file: ", req.file);

    const category = new Category({
      name: "test",
      user: req.user.id,
      imageSrc: req.files ? req.files.files.path : "",
    });

    // form.parse(req, (err, fields, files) => {
    //   console.log("files: ", files);
    //   console.log("err: ", err);
    //   console.log("fields: ", fields);
    // });

    await category.save();

    res.status(201).json(category);
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.update = function (req, res) {
  try {
  } catch (e) {
    errorHandler(res, e);
  }
};
