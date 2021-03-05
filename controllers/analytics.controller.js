const moment = require("moment");

const Order = require("../models/Order.model");
const { errorHandler } = require("../utils/errorHandler.util");

module.exports.overview = function (req, res) {
  try {
    Order.find({ user: req.user._id })
      .sort({ date: 1 })
      .then(
        (orders) => {
          const ordersMap = getOrdersMap(orders);
          const yesterdayOrders =
            ordersMap[moment().add(-1, "d").format("DD.MM.YYYY")] || [];
          const yesterdayOrdersQuantity = yesterdayOrders.length;
          const totalOrdersQuantity = orders.length;
          const daysQuantity = Object.keys(ordersMap).length;
          const ordersQuantityPerDay = (
            totalOrdersQuantity / daysQuantity
          ).toFixed(0);

          const ordersPercent = (
            (yesterdayOrdersQuantity / ordersQuantityPerDay - 1) *
            100
          ).toFixed(2);

          const totalIncome = calculatePrice(orders);
          const incomePerDay = totalIncome / daysQuantity;
          const yesterdayIncome = calculatePrice(yesterdayOrders);
          const yesterdayIncomePercent = (
            (yesterdayIncome / incomePerDay - 1) *
            100
          ).toFixed(2);
          const compareIncome = (yesterdayIncome - incomePerDay).toFixed(2);
          const compareOrdersQuantity = (
            yesterdayOrdersQuantity - ordersQuantityPerDay
          ).toFixed(2);

          res.status(200).json({
            gain: {
              percent: Math.abs(+yesterdayIncomePercent),
              compare: Math.abs(+compareIncome),
              yesterday: +yesterdayIncome,
              isHigher: +yesterdayIncomePercent > 0,
            },
            orders: {
              percent: Math.abs(+ordersPercent),
              compare: Math.abs(+compareOrdersQuantity),
              yesterday: +yesterdayOrdersQuantity,
              isHigher: +ordersPercent > 0,
            },
          });
        },
        (e) => errorHandler(res, e)
      );
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.analytics = function (req, res) {
  try {
    Order.find({ user: req.user._id })
      .sort({ date: 1 })
      .then(
        (orders) => {
          const ordersMap = getOrdersMap(orders);
          const averageCheckPerDay = +(
            calculatePrice(orders) / Object.keys(ordersMap).length
          ).toFixed(2);

          const chart = Object.keys(ordersMap).map((label) => {
            const gain = calculatePrice(ordersMap[label]);
            const order = ordersMap[label].length;

            return { label, gain, order };
          });
          res.status(200).json({
            average: averageCheckPerDay,
            chart,
          });
        },
        (e) => errorHandler(res, e)
      );
  } catch (e) {
    errorHandler(res, e);
  }
};

function getOrdersMap(orders = []) {
  const daysOrders = {};

  orders.forEach((order) => {
    const date = moment(order.date).format("DD.MM.YYYY");

    if (date === moment().format("DD.MM.YYYY")) {
      return;
    }

    if (!daysOrders[date]) {
      daysOrders[date] = [];
    }

    daysOrders[date].push(order);
  });

  return daysOrders;
}

function calculatePrice(orders = []) {
  return orders.reduce((total, order) => {
    const orderPrice = order.list.reduce((orderTotal, item) => {
      orderTotal += item.cost * item.quantity;
      return orderTotal;
    }, 0);

    total += orderPrice;
    return total;
  }, 0);
}
