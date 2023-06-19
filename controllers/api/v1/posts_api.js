const Post = require("../../../models/post");
const Comment = require("../../../models/comment");

module.exports.index = async function (req, res) {
  try {
    const posts = await Post.find({})
      .sort("-createdAt")
      .populate("user", "name")
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "name",
        },
        // options: {
        //   sort: "-createdAt",
        // },
      });

    return res.status(200).json({
      message: "List of posts",
      posts: posts,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports.destroy = async function (req, res) {
  try {
    const post = await Post.findById(req.params.id);

    // .id means converting the objectId into string
    if (post && post.user == req.user.id) {
      await Post.deleteOne({ _id: req.params.id });

      await Comment.deleteMany({ post: req.params.id });

      return res.status(200).json({
        message: "Post and associated comments deleted!",
      });
    }

    return res.status(401).json({
      message: "You are not authorized to delete this post!",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
