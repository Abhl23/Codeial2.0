const Post = require("../models/post");
const Comment = require("../models/comment");
const Like = require("../models/like");

module.exports.create = async function (req, res) {
  try {
    const post = await Post.create({
      content: req.body.content,
      user: req.user._id,
    });

    // await post.populate({
    //   path: "user",
    //   select: "name"
    // });

    await post.populate("user", "name");

    // check if the request is AJAX
    if (req.xhr) {
      return res.status(200).json({
        data: {
          post,
        },
        message: "Post Published!",
      });
    }

    req.flash("success", "Post Published!");
    return res.redirect("back");
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
    });

    // req.flash("error", err);
    // return res.redirect("back");
  }
};

module.exports.destroy = async function (req, res) {
  try {
    const post = await Post.findById(req.params.id);

    // .id means converting the objectId into string
    if (post && post.user == req.user.id) {
      // deleting likes of comments of the post
      await Like.deleteMany({
        likeable: { $in: post.comments },
        onModel: "Comment",
      });

      await Post.deleteOne({ _id: req.params.id });

      await Comment.deleteMany({ post: req.params.id });

      // deleting likes of the post
      await Like.deleteMany({
        likeable: req.params.id,
        onModel: "Post",
      });

      if (req.xhr) {
        return res.status(200).json({
          data: {
            post_id: req.params.id,
          },
          message: "Post and associated comments deleted!",
        });
      }

      req.flash("success", "Post and associated comments deleted!");
      return res.redirect("back");
    }

    return res.status(401).json({
      message: "You are not authorized to delete this post!",
    });

    // req.flash("error", "You are not authorized to delete this post");
    // return res.redirect("back");
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
    });

    // req.flash("error", err);
    // return res.redirect("back");
  }
};
