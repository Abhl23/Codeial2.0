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

      post.comments.push(comment);
      post.save();

      return res.redirect("/");
    }

    console.log("Said post does not exist");
    return res.redirect("/");
  } catch (err) {
    console.log("Error in creating a comment in the db");
    return;
  }
};
