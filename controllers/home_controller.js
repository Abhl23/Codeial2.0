const Post = require("../models/post");
const User = require("../models/user");

module.exports.home = async function (req, res) {
  try {
    // populate the user of each post
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

    const users = await User.find({});

    let signedInUser;

    if (req.user) {
      signedInUser = await User.findById(req.user._id).populate(
        "friendships",
        "name"
      );
    }

    // Cannot use 'user' as a variable name because locals.user already exists
    return res.render("home", {
      title: "Codeial | Home",
      posts,
      all_users: users,
      signedInUser: signedInUser,
    });
  } catch (err) {
    console.log("**********", err);
    req.flash("error", err);
    return res.redirect("back");
  }
};

// module.exports.actionName=function(req, res){};
