var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CommentSchema = new Schema({
  body: {
    type: String,
    required: true
  },
  user:
    {
      type: Schema.Types.ObjectId,
      ref: "users"
    }

});

var Comment = mongoose.model("comment", CommentSchema);

module.exports = Comment;
