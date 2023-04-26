const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = async function(req, res) {
  try {
    const post = await Post.findById(req.body.post);

    if (post) {
      const comment = await Comment.create({
        content: req.body.content,
        post: req.body.post,
        user: req.user._id
      });

      post.comments.push(comment);
      await post.save();

      res.redirect('/');
    } else {
      throw new Error('Post not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating comment');
  }
};
