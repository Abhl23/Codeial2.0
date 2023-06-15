const jwt = require("jsonwebtoken");

const User = require("../../../models/user");

module.exports.createSession = async function (req, res) {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user || user.password != req.body.password) {
      return res.status(422).json({
        message: "Incorrect Email/Password",
      });
    }

    return res.status(200).json({
      data: {
        token: jwt.sign(user.toJSON(), "codeial", { expiresIn: "6000000" }),
      },
      message: "Sign in successful, here is your token, please keep it safe!",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
