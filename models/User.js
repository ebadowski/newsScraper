var mongoose = require("mongoose");

var Schema = mongoose.Schema;


var UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  imgLink: {
    type: String,
    required: true
  }
});

var User = mongoose.model("users", UserSchema);

module.exports = User;