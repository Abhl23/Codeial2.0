const Post = require("../models/post");
const Comment = require("../models/comment");

module.exports.create = async function (req, res) {
  try {
    const post = await Post.create({
      content: req.body.content,
      user: req.user._id,
    });

    req.flash('success', "Post Published!");
    return res.redirect("back");
  } catch (err) {
    
    req.flash('error', err);
    return res.redirect('back');
  }
};

module.exports.destroy = async function (req, res) {
  try {
    const post = await Post.findById(req.params.id);

    // .id means converting the objectId into string
    if (post && post.user == req.user.id) {
      await Post.deleteOne({ _id: req.params.id });

      await Comment.deleteMany({ post: req.params.id });

      req.flash('success', "Post and associated comments deleted!");
      return res.redirect("back");
    }

    req.flash('error', "You are not authorized to delete this post");
    return res.redirect("back");
  } catch (err) {
    req.flash('error', err);
    return res.redirect("back");
  }
};
