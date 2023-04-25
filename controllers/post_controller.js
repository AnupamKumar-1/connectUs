const Post = require('../models/post');

const User = require("../models/user");

module.exports.create = async function(req, res) {
    try {
        const user = await User.findById(req.user._id); // Get the current logged in user
        const post = await Post.create({
            content: req.body.content,
            user: user._id
        });
        await Post.populate(post, { path: 'user', select: 'name' }); // Populate the user field
        return res.redirect('back');
    } catch (err) {
        console.log('error in creating post', err);
        return res.status(500).send('Internal Server Error');
    }
};