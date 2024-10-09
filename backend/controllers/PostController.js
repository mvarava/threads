// const bcrypt = require('bcryptjs');
// const JDentIcon = require('jdenticon');
// const path = require('path');
// const fs = require('fs');
// const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const User = require('../models/User');
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

      await User.findByIdAndUpdate(authorId, { $push: { posts: newPost._id } });

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
        .populate({
          path: 'comments',
        })
        .sort({ createdAt: -1 });

      const postsWithLikeInfo = posts.map((post) => ({
        ...post.toObject(),
        likedByUser: post.likes.some((like) => like.userId === userId),
      }));

      res.json(postsWithLikeInfo);
    } catch (error) {
      console.error('Error in getAllPosts: ', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  getPostById: async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    try {
      const wantedPost = await Post.findById(id)
        .populate({
          path: 'comments',
          populate: {
            path: 'user',
            select: '-password -posts -likes -comments -followers -following',
          },
        })
        .populate({
          path: 'likes',
          populate: {
            path: 'user',
            select: '-password -posts -likes -comments -followers -following',
          },
        })
        .populate({
          path: 'author',
          select: '-password -posts -likes -comments -followers -following',
        });

      if (!wantedPost) {
        return res.status(404).json({ error: 'Such post was not found' });
      }

      const postWithLikeInfo = {
        ...wantedPost.toObject(),
        likedByUser: wantedPost.likes.some((like) => like.userId === userId),
      };

      res.json(postWithLikeInfo);
    } catch (error) {
      console.error('Error in getPostById: ', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  deletePost: async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    const postToDelete = await Post.findById(id);

    if (!postToDelete) {
      return res.status(404).json({ error: 'Such post was not found' });
    }

    if (!postToDelete.author.equals(userId)) {
      return res.status(403).json({ error: 'No permission' });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      await Comment.deleteMany({ post: id }).session(session);

      await Like.deleteMany({ post: id }).session(session);

      await Post.deleteOne({ _id: id }).session(session);

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({ message: 'Post and related data deleted successfully' });
    } catch (error) {
      console.error('Error in deletePost: ', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

module.exports = PostController;
