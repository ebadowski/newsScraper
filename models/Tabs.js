var mongoose = require("mongoose");

var Schema = mongoose.Schema;


var TabSchema = new Schema({
  date: {
    type: String,
    required: true,
    unique: true
  },
  articles: [
    {
      type: Schema.Types.ObjectId,
      ref: "newsscrapers"
    }
  ]
});

var Tab = mongoose.model("tabs", TabSchema);

module.exports = Tab;


