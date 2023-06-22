const Friendship = require("../models/friendship");
const User = require("../models/user");

module.exports.toggleFriendship = async function (req, res) {
  try {
    let existingFriendship;
    let friendshipExists = true;

    let profileUser = await User.findById(req.params.id);

    // check if freindship already exists
    existingFriendship = await Friendship.findOne({
      from_user: req.user._id,
      to_user: req.params.id,
    });

    if (!existingFriendship) {
      existingFriendship = await Friendship.findOne({
        from_user: req.params.id,
        to_user: req.user._id,
      });
    }

    // if friendship already exists, then delete it
    if (existingFriendship) {
      req.user.friendships.pull(req.params.id);
      req.user.save();

      profileUser.friendships.pull(req.user._id);
      profileUser.save();

      await Friendship.deleteOne({
        from_user: req.user._id,
        to_user: req.params.id,
      });

      await Friendship.deleteOne({
        from_user: req.params.id,
        to_user: req.user._id,
      });

      friendshipExists = false;
    }
    // if friendship does not exist, create one
    else {
      await Friendship.create({
        from_user: req.user._id,
        to_user: req.params.id,
      });

      req.user.friendships.push(req.params.id);
      req.user.save();

      profileUser.friendships.push(req.user._id);
      profileUser.save();
    }

    return res.status(200).json({
      data: {
        friendshipExists: friendshipExists,
      },
      message: `${friendshipExists ? "Friend Added!" : "Friend Removed!"}`,
    });
  } catch (err) {
    console.log("Error in toggleFriendship action", err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
