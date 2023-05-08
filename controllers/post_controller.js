const Post = require('../models/post');
const Comment = require('../models/comment');

const User = require("../models/user");

module.exports.create = async function(req, res) {
  try {
    const user = await User.findById(req.user._id); // Get the current logged in user
    const post = await Post.create({
      content: req.body.content,
      user: user._id
    });
    await Post.populate(post, { path: 'user', select: 'name ' }); // Populate the user field with name and avatar fields
    const populatedPost = await Post.findById(post._id).populate('user', 'name ');
    if (req.xhr) {
      return res.status(200).json({
        data: {
          post: post
        },
        message: "Post created!"
      });
    }
    console.log(post.user.avatar);
   
    return res.status(200).json({
      data: {
        post: populatedPost
      },
      message: "Post created!"
    });
  } catch (err) {
    console.log('error in creating post', err);
    return res.status(500).send('Internal Server Error');
  }
};



module.exports.destroy = async function(req, res) {
    try {
      const post = await Post.findById(req.params.id);
      if (post.user.toString() === req.user._id.toString()) {
        await post.deleteOne();
        await Comment.deleteMany({ post: req.params.id });

        if (req.xhr){
          return res.status(200).json({
              data: {
                  post_id: req.params.id
              },
              message: "Post deleted"
          });
      }
        return res.redirect("back");
      } else {
        console.log('can not delete');
        console.log('post.user', post.user);
        console.log('req.user', req.user);
        return res.redirect("back");
      }
    } catch (err) {
      console.error(err);
      return res.redirect("back");
    }
  };
  