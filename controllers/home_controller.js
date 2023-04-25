const Post = require('../models/post');
const User = require("../models/user");
const passport = require("../config/passport-local-strategy");

module.exports.home = async function(req, res) {
    try {
      const posts = await Post.find().populate('user', 'name');
        
      return res.render('home', {
        title: 'connectus | home',
        posts,
        
        
      });
    } catch (err) {
      console.error(err);
      
    }
  };

