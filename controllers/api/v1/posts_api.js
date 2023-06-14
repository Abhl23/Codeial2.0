const Post = require("../../../models/post");

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
