const Post = require("../models/post");
const Comment = require("../models/comment");

module.exports.create = async function (req, res) {
  try {
    const post = await Post.create({
      content: req.body.content,
      user: req.user._id,
    });

    return res.redirect("back");
  } catch (err) {
    console.log("Error in creating a post in the db");
    return;
  }
};

module.exports.destroy = async function (req, res) {
  try {
    const post = await Post.findById(req.params.id);

    // .id means converting the objectId into string
    if (post && post.user == req.user.id) {
      await Post.deleteOne({ _id: req.params.id });

      await Comment.deleteMany({ post: req.params.id });

      return res.redirect("back");
    }

    console.log("You do not have authorization to delete the post");
    return res.redirect("back");
  } catch (err) {
    console.log("Error in deleting a post in the db");
    return;
  }
};
