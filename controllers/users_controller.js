const User = require("../models/user");

module.exports.profile = async function (req, res) {
  try{
    const user=await User.findById(req.params.id);

    return res.render("user_profile", {
      title: "User Profile",
      profile_user: user
    });
  }catch(err){

    req.flash("error", err);
    return res.redirect('back');
  }
};

module.exports.update=async function(req, res){
  try{
    if(req.user.id == req.params.id){
      await User.findByIdAndUpdate(req.params.id, req.body);

      req.flash('success', 'Profile Updated Successfully!');
      return res.redirect('back');
    }
    else{
      req.flash('error', "You are not authorized to update this profile!");
      return res.redirect('back');
    }
  }catch(err){
    req.flash('error', err);
    return res.redirect('back');
  }
};

// render the sign up page
module.exports.signUp = function (req, res) {
  if(req.isAuthenticated()){
    return res.redirect('/users/profile');
  }

  return res.render("user_sign_up", {
    title: "Codeial | Sign Up",
  });
};

// render the sign in page
module.exports.signIn = function (req, res) {
  if(req.isAuthenticated()){
    return res.redirect('/users/profile');
  }

  return res.render("user_sign_in", {
    title: "Codeial | Sign In",
  });
};

// get the sign up data
module.exports.create = async function (req, res) {
  if (req.body.password != req.body.confirm_password){

    req.flash('error', "Password does not match!");
    return res.redirect("back");
  }
    

  try {
    const user = await User.findOne({ email: req.body.email });

    if(!user){
        await User.create(req.body);

        req.flash('success', "Account Created Successfully!");
        return res.redirect('/users/sign-in');
    }
    else{
      req.flash('error', 'Email already exists!');
      return res.redirect('back');
    }
        
  } catch (err) {
    req.flash('error', err);
    return res.redirect('back');
  }
};

// sign-in and create a session for the user
module.exports.createSession = function (req, res) {
  req.flash('success', 'Logged In Successfully!');
  return res.redirect('/');
};

// sign-out and delete the user's session
module.exports.destroySession=function(req, res){
  req.logout(function(err){
    if(err){
      req.flash('error', err);
      return res.redirect('back');
    }

    req.flash('success', 'You have logged out!');
    return res.redirect('/');
  });
};
