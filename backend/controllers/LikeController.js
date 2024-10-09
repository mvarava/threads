const Post = require('../models/Post');
const Like = require('../models/Like');

const LikeController = {
  likePost: async (req, res) => {
    const { postId } = req.body;
    const userId = req.user.userId;

    if (!postId) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      const post = await Post.findById(postId);

      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      const existingLike = await Like.findOne({ post: postId, user: userId });

      if (existingLike) {
        return res.status(400).json({ error: 'You have already liked this post' });
      }

      const newLike = new Like({
        user: userId,
        post: postId,
      });

      await newLike.save();

      const likeResponse = newLike.toObject();
      res.status(201).json(likeResponse);
    } catch (error) {
      console.error('Error in likePost: ', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  unlikePost: async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    if (!id) {
      return res.status(400).json({ error: 'You must enter id of the post to unlike it' });
    }

    try {
      const likeToUnmake = await Like.findOne({ post: id, user: userId });

      if (!likeToUnmake) {
        return res.status(400).json({ error: "You can't unlike" });
      }

      await Like.findOneAndDelete({ post: id, user: userId });

      res.status(204).json({ message: 'Like was deleted successfully' });
    } catch (error) {
      console.error('Error in unlikePost: ', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

module.exports = LikeController;
