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

      return res.redirect("/");
    }

    console.log("Said post does not exist");
    return res.redirect("/");
  } catch (err) {
    console.log("Error in creating a comment in the db");
    return;
  }
};

module.exports.destroy = async function (req, res) {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      console.log("Comment does not exist in the db");
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

      return res.redirect("back");
    }
    else {
      console.log("You do not have authorization to delete the comment");
      return res.redirect("back");
    }

  } catch (err) {
    console.log(`Error in deleting a comment from the db, ${err}`);
    return;
  }
};
