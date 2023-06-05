const Post = require("../models/post");

module.exports.home = async function (req, res) {
  try {
    // populate the user of each post
    const posts = await Post.find({}).populate("user");

    return res.render("home", {
      title: "Codeial | Home",
      posts,
    });
  } catch (err) {
    console.log("Error in finding posts from the db");
    return;
  }
};

// module.exports.actionName=function(req, res){};
