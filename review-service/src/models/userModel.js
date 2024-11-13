const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString(),
  },
  firstName: {
    type: String,
    required: [true, "Please tell firstName"],
  },
  lastName: {
    type: String,
    required: [true, "Please tell firstName"],
  },
  photo: {
    type: String,
    required: [true, "Please tell photo"],
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
