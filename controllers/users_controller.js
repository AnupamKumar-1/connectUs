const User = require('../models/user');


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
exports.update = async function(req, res) {
    try {
      if (req.user.id == req.params.id) {
        const user = await User.findByIdAndUpdate(req.params.id, req.body);
        return res.redirect('back');
      } else {
        return res.status(401).send('Unauthorized');
      }
    } catch (error) {
      console.error(error);
      return res.status(500).send('Internal Server Error');
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
