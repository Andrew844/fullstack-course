const Order = require("../models/Order.model");
const { errorHandler } = require("../utils/errorHandler.util");

module.exports.getAll = function (req, res) {
  try {
    const query = {
      user: req.user._id,
    };

    if (req.query.start) {
      query.date = { $gte: req.query.start };
    }

    if (req.query.end) {
      if (!query.date) {
        query.date = {};
      }

      query.date["$lte"] = req.query.end;
    }

    if (req.query.order) {
      query.order = +req.query.order;
    }

    Order.find(query)
      .sort({ date: -1 })
      .skip(+req.query.offset)
      .limit(+req.query.limit)
      .then(
        (orders) => {
          res.status(200).json(orders);
        },
        (e) => errorHandler(res, e)
      );
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.create = async function (req, res) {
  try {
    const lastOrder = await Order.findOne({ user: req.user._id }).sort({
      date: -1,
    });

    const maxOrder = lastOrder ? lastOrder.order : 0;

    const order = await new Order({
      list: req.body.list,
      user: req.user._id,
      order: maxOrder + 1,
    }).save();

    res.status(201).json(order);
  } catch (e) {
    errorHandler(res, e);
  }
};
