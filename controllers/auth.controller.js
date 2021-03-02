const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys.config");

const { errorHandler } = require("../utils/errorHandler.util");
const User = require("../models/User.model");

module.exports.login = function (req, res) {
  User.findOne({ email: req.body.email }).then(
    (candidate) => {
      if (!candidate) {
        return res.status(409).json({
          message: "Неверный email или пароль.",
        });
      }

      const pwdMatch = bcrypt.compareSync(
        req.body.password,
        candidate.password
      );

      if (!pwdMatch) {
        return res.status(409).json({
          message: "Неверный email или пароль.",
        });
      }

      const token = jwt.sign(
        {
          email: candidate.email,
          userId: candidate._id,
        },
        keys.jwtSecret,
        {
          expiresIn: 3600,
        }
      );

      res.status(200).json({ token: `Bearer ${token}` });
    },
    () => {
      res.status(500).json({ message: "Что-то пошло не так." });
    }
  );
};

module.exports.register = function (req, res) {
  try {
    User.findOne({ email: req.body.email }).then(
      (candidate) => {
        if (candidate) {
          return res.status(409).json({
            message: "Пользователь с таким email уже зарегистрирован.",
          });
        }

        const salt = bcrypt.genSaltSync(10);

        const user = new User({
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password, salt),
        });
        user
          .save()
          .then((user) => {
            res.status(201).json({ user });
          })
          .catch((err) => {
            console.log(err);
            res
              .status(409)
              .json({ message: "Не удалось зарегистрировать пользователя." });
          });
      },
      (e) => {
        errorHandler(res, e);
      }
    );
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Что-то пошло не так." });
  }
};
