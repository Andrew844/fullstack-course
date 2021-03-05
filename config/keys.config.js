if (process.env.NODE_ENV === "production") {
  module.exports = require("./keys.config.prod");
} else {
  module.exports = require("./keys.config.dev");
}
