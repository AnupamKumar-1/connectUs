const User = require('../models/user');
const fs = require('fs');
const path = require('path');

module.exports.profile = async function(req, res) {
    try {
      const user = await User.findById(req.params.id);
      return res.render('user_profile', {
        title: 'User Profile',
        profile_user: user
      });
    } catch (err) {
      console.error(err);
      
    }
  }
  module.exports.update = async function(req, res) {
    if (req.user.id == req.params.id) {
      try {
        let user = await User.findById(req.params.id);
        let avatarPath = user.avatar;
  
        User.uploadedAvatar(req, res, async function(err) {
          if (err) {
            console.log('Multer Error: ', err);
          }
  
          user.name = req.body.name;
          user.email = req.body.email;
  
          if (req.file) {
            if (avatarPath) {
              fs.unlinkSync(path.join(__dirname, '..', avatarPath));
            }
            // Save the path of the uploaded file into the avatar field in the user
            user.avatar = User.avatarPath + '/' + req.file.filename;
          }
  
          // Wait for the user to save before redirecting
          await user.save();
  
          return res.redirect('back');
        });
      } catch (err) {
        console.log(err);
        return res.redirect('back');
      }
    } else {
      return res.status(401).send('Unauthorized');
    }
  };
  


 


module.exports.signUp = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_up', {
        title: 'connectus | sign-up'
    })
}

module.exports.signIn = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    return res.render('user_sign_in', {
        title: 'connectus | sign-in'
    })
}

// get the sign up data
module.exports.create = async function (req, res) {
    if (req.body.password != req.body.confirm_password) {
        return res.redirect('back');
    }

    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            await User.create(req.body);
            return res.redirect('/users/sign-in');
        } else {
            return res.redirect('back');
        }
    } catch (err) {
        console.log('error in signing up:', err);
        return;
    }
}

// sign in and create a session for the user
module.exports.createSession = function (req, res) {
    req.flash('success','Logged in succesfully !');
    return res.redirect('/');
}

module.exports.destroySession = function (req, res) {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash('success','Logged out succesfully !');
        return res.redirect('/users/sign-in');
    });
};
