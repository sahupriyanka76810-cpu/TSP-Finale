//Post.js

const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a title"],
  },
  content: {
    type: String,
    required: [true, "Please provide content"],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // This tells Mongoose to link to the User model
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set to current date/time
  },
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;