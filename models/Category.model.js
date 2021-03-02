const mongoose = require("mongoose");
const { Schema } = mongoose;

const categorySchema = Schema({
  name: { type: String, required: true },
  imageSrc: { type: String, default: "" },
  user: { ref: "users", type: Schema.Types.ObjectId },
});

module.exports = mongoose.model("categories", categorySchema);
