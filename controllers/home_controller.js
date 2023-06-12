const Post = require("../models/post");
const User = require("../models/user");

module.exports.home = async function (req, res) {
  try {
    // populate the user of each post
    const posts = await Post.find({})
      .sort("-createdAt")
      .populate("user")
      .populate({
        path: "comments",
        populate: {
          path: "user",
        },
      });

    const users = await User.find({});

    // Cannot use 'user' as a variable name because locals.user already exists
    return res.render("home", {
      title: "Codeial | Home",
      posts,
      all_users: users,
    });
  } catch (err) {
    req.flash("error", err);
    return res.redirect("back");
  }
};

// module.exports.actionName=function(req, res){};
