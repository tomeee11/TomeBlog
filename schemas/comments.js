const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema({
  postId: {
    type: String,
  },
  user: {
    type: String,
  },
  createdAt: {
    type: Date,
  },
  content: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model("Comments", commentsSchema);
