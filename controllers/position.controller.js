const Position = require("../models/Position.model");
const { errorHandler } = require("../utils/errorHandler.util");

module.exports.getByCategoryId = function (req, res) {
  try {
    Position.find({ category: req.params.categoryId, user: req.user.id }).then(
      (positions) => {
        res.status(200).json({ data: positions });
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
    const position = new Position({
      name: req.body.name,
      cost: req.body.cost,
      category: req.body.category,
      user: req.user.id,
    });

    position
      .save()
      .then((position) => {
        res.status(201).json(position);
      })
      .catch((e) => errorHandler(res, e));
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.remove = function (req, res) {
  try {
    Position.remove({ _id: req.params.id }).then(
      () => {
        res.status(200).json({ message: "Позиция была удалена." });
      },
      (e) => errorHandler(res, e)
    );
  } catch (e) {
    errorHandler(res, e);
  }
};
module.exports.update = function (req, res) {
  try {
    Position.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true }
    ).then(
      (position) => res.status(200).json(position),
      (e) => errorHandler(res, e)
    );
  } catch (e) {
    errorHandler(res, e);
  }
};
