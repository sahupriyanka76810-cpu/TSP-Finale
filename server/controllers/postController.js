//postContoller.js
const Post = require("../models/Post");

//Create Posts

const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    // Check if both fields are provided
    if (!title || !content) {
      return res.status(400).json({
        message: "Please provide title and content"
      });
    }

    // Create the post with the logged-in user as the author
    const post = await Post.create({
      title,
      content,
      author: req.user._id,
    });

    // Populate the author field before sending back
    await post.populate("author", "name");

    res.status(201).json(post);
  } catch (error) {
    console.error("Create post error:", error.message);
    res.status(500).json({
      message: "Server error while creating post"
    });
  }
};

//Get Posts

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error("Get posts error:", error.message);
    res.status(500).json({ message: "Server error while fetching posts" });
  }
};


//update post

const updatePost = async (req, res) => {
  try {
    const { title, content } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only edit your own posts" });
    }

    // Update the post fields
    post.title = title || post.title;
    post.content = content || post.content;

    // Save the updated post
    const updatedPost = await post.save();
    await updatedPost.populate("author", "name");

    res.json(updatedPost);
  } catch (error) {
    console.error("Update post error:", error.message);
    res.status(500).json({ message: "Server error while updating post" });
  }
};


// DELETE A POST

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only delete your own posts" });
    }

    // Delete the post
    await Post.findByIdAndDelete(req.params.id);

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Delete post error:", error.message);
    res.status(500).json({ message: "Server error while deleting post" });
  }
};

// GET LOGGED-IN USER'S POSTS

const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user._id })
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Get my posts error:", error.message);
    res.status(500).json({ message: "Server error while fetching your posts" });
  }
};


// GET SINGLE POST BY ID

const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "name email");

    if (!post) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("Get post by ID error:", error.message);

    if (error.name === "CastError") {
      return res.status(404).json({ message: "Blog post not found" });
    }
    res.status(500).json({ message: "Server error while fetching post detail" });
  }
};

module.exports = {
  getAllPosts,
  getMyPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};



// module.exports = {
//   createPost,
//   getAllPosts
// };

