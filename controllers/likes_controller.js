const Like = require("../models/like");
const Post = require("../models/post");
const Comment = require("../models/comment");

module.exports.toggleLike = async function (req, res) {
  try {
    let likeable;
    let deleted = false;        // tells you in the frontend if the like has been created or destroyed

    // finding likeable
    if (req.query.type == "Post") {
      likeable = await Post.findById(req.query.id);
    } else {
      likeable = await Comment.findById(req.query.id);
    }

    // check if the like already exists
    let existingLike = await Like.findOne({
      user: req.user._id,
      likeable: req.query.id,
      onModel: req.query.type,
    });

    // if the like already exists then delete it
    if (existingLike) {
      likeable.likes.pull(existingLike._id);
      likeable.save();

      await Like.findByIdAndDelete(existingLike._id);

      deleted = true;
    }
    // else make a new like
    else {
      let newLike = await Like.create({
        user: req.user._id,
        likeable: req.query.id,
        onModel: req.query.type,
      });

      likeable.likes.push(newLike._id);
      likeable.save();
    }

    return res.status(200).json({
      message: `${deleted ? "Like Removed!" : "Like Added!"}`,
      data: {
        deleted: deleted,
      },
    });
  } catch (err) {
    console.log(`Error: ${err}`);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
