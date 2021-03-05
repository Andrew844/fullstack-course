const Category = require("../models/Category.model");
const Position = require("../models/Position.model");
const { errorHandler } = require("../utils/errorHandler.util");

module.exports.getAll = function (req, res) {
  try {
    console.log(req.user._id === "603cdae1980af8231c7e4020");
    Category.find({ user: req.user._id }).then(
      (categories) => {
        res.status(200).json({ categories });
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

module.exports.create = function (req, res) {
  try {
    new Category({
      name: req.body.name,
      user: req.user._id,
      imageSrc: req.file ? req.file.path : "",
    })
      .save()
      .then((category) => {
        res.status(201).json(category);
      })
      .catch((e) => errorHandler(res, e));
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.update = function (req, res) {
  try {
    const updated = {
      name: req.body.name,
    };

    if (req.file) {
      updated.imageSrc = req.file.path;
    }

    Category.findOneAndUpdate(
      { _id: req.params.id },
      { $set: updated },
      { new: true }
    ).then(
      (category) => {
        res.status(200).json(category);
      },
      (e) => errorHandler(res, e)
    );
  } catch (e) {
    errorHandler(res, e);
  }
};
