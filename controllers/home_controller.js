const Post = require('../models/post');
const User = require('../models/user');
const passport = require('../config/passport-local-strategy');

module.exports.home = async function(req, res) {
  try {
    const posts = await Post.find()
    .sort('createdAt')
    .populate({
      path: 'user',
      select: 'name avatar'
    })
    .populate({
      path: 'comments',
      populate: {
        path: 'user',
        select: 'name'
      }
    });

    let users = await User.find({});

        return res.render('home', {
            title: "connectus | Home",
            posts:  posts,
            all_users: users
        });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error getting posts');
  }
};
