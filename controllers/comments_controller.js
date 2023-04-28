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

      // Populate the user field with the corresponding user document
      await comment.populate('user');

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

module.exports.destroy = async function(req, res){
  try {
    const comment = await Comment.findById(req.params.id);
    if (comment.user.toString() === req.user.id.toString()) {
      let postId = comment.post;
      await comment.deleteOne();
      await Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id }});
    }
    return res.redirect('back');
  } catch (err) {
    console.error(err);
    return res.redirect('back');
  }
}
