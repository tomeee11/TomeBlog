const mongoose = require("mongoose");

const postsSchema = new mongoose.Schema({
  postsId: {
    type: String,
  },
  user: {
    type: String,
  },
  title: {
    type: String,
  },
  createdAt: {
    type: Date,
  },
  content: {
    type: String,
  },
  password: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Posts", postsSchema);
