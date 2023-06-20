const mongoose = require("mongoose");

const postsSchema = new mongoose.Schema({
  postsId: {
    type: String,
  },
  userId: {
    type: String,
  },
  title: {
    type: String,
  },
  nickname: {
    type: String,
  },
  content: {
    type: String,
  },
},
{
  timestamps:true
}
);

module.exports = mongoose.model("Posts", postsSchema);
