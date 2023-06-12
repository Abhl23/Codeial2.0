const { Error } = require("mongoose");
const Comment = require("../models/comment");
const Post = require("../models/post");

module.exports.create = async function (req, res) {
  try {
    const post = await Post.findById(req.body.post);

    if (post) {
      const comment = await Comment.create({
        content: req.body.content,
        user: req.user._id,
        post: req.body.post,
      });

      await Post.findByIdAndUpdate(req.body.post, {
        $push: { comments: comment.id },
      });

      // post.comments.push(comment);
      // post.save();

      await comment.populate("user", "name");

      if (req.xhr) {
        return res.status(200).json({
          data: {
            comment,
          },
          message: "Comment Created!",
        });
      }

      req.flash("success", "Comment Created!");
      return res.redirect("/");
    }

    req.flash("error", "Said post does not exist!");
    return res.redirect("/");
  } catch (err) {
    req.flash("error", err);
    return res.redirect("back");
  }
};

module.exports.destroy = async function (req, res) {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      req.flash("error", "Said comment does not exist!");
      return res.redirect("back");
    }

    const postId = comment.post;

    const post = await Post.findByIdAndUpdate(postId, {
      $pull: {
        comments: req.params.id,
      },
    }).populate("user");
    // authorization check for user of the comment OR user of the post
    // only either of these can delete the comment
    if (comment.user == req.user.id || post.user.id == req.user.id) {
      await Comment.findByIdAndDelete(req.params.id);

      req.flash("success", "Comment Deleted!");
      return res.redirect("back");
    } else {
      req.flash("error", "You are not authorized to delete this comment!");
      return res.redirect("back");
    }
  } catch (err) {
    req.flash("error", Error);
    return res.redirect("back");
  }
};
