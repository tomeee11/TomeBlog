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
    type: String,
  },
  content: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Posts", postsSchema);
