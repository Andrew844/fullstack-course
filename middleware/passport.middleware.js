const { Strategy } = require("passport-jwt");
const { ExtractJwt } = require("passport-jwt");
const { model } = require("mongoose");

const keys = require("../config/keys.config");
const User = model("users");

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: keys.jwtSecret,
};

module.exports = (passport) => {
  passport.use(
    new Strategy(options, (payload, done) => {
      User.findById(payload.userId).then(
        (candidate) => {
          const { email, _id } = candidate;

          if (candidate) {
            done(null, { email, _id });
            return;
          }

          done(null, false);
        },
        (e) => {
          console.log("Passport js error: ", e);
        }
      );
    })
  );
};
