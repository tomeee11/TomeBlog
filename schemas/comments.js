const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema({
  postId: {
    type: String,
  },
  userId: {
    type: String,
  },
  nickname: {
    type: String,
  },
  comment: {
    type: String,
  },
},
{
  timestamps:true
}
);

module.exports = mongoose.model("Comments", commentsSchema);
