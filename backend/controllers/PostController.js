const mongoose = require('mongoose');

const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Like = require('../models/Like');

const PostController = {
  createPost: async (req, res) => {
    const { content } = req.body;
    const authorId = req.user.userId;

    if (!content) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      const newPost = new Post({
        content,
        author: authorId,
      });

      await newPost.save();

      const postResponse = newPost.toObject();
      res.status(201).json(postResponse);
    } catch (error) {
      console.error('Error in createPost: ', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  getAllPosts: async (req, res) => {
    const userId = req.user.userId;

    try {
      const posts = await Post.find()
        .populate({
          path: 'author',
          select: '-password',
        })
        .sort({ createdAt: -1 });

      const postsWithDetails = await Promise.all(
        posts.map(async (post) => {
          const comments = await Comment.find({ post: post._id })
            .populate({ path: 'user', select: '-password' })
            .sort({ createdAt: -1 });

          const likes = await Like.find({ post: post._id });

          const isLikedByUser = likes.some((like) => like.user.equals(userId));

          return {
            ...post.toObject(),
            comments,
            likes,
            isLikedByUser,
          };
        }),
      );

      res.json(postsWithDetails);
    } catch (error) {
      console.error('Error in getAllPosts: ', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  getPostById: async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    try {
      const wantedPost = await Post.findById(id);

      if (!wantedPost) {
        return res.status(404).json({ error: 'Such post was not found' });
      }

      const comments = await Comment.find({ post: id });
      const likes = await Like.find({ post: id });
      const isLikedByUser = likes.some((like) => like.user.equals(userId));

      res.json({ ...wantedPost.toObject(), comments, likes, isLikedByUser });
    } catch (error) {
      console.error('Error in getPostById: ', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  deletePost: async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    try {
      const postToDelete = await Post.findById(id);

      if (!postToDelete) {
        return res.status(404).json({ error: 'Such post was not found' });
      }

      if (!postToDelete.author.equals(userId)) {
        return res.status(403).json({ error: 'No permission' });
      }

      const session = await mongoose.startSession();
      session.startTransaction();

      await Comment.deleteMany({ post: id }).session(session);
      await Like.deleteMany({ post: id }).session(session);
      await Post.deleteOne({ _id: id }).session(session);

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({ message: 'Post and related data was deleted successfully' });
    } catch (error) {
      console.error('Error in deletePost: ', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

module.exports = PostController;
