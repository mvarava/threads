const bcrypt = require('bcryptjs');
const JDentIcon = require('jdenticon');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const Post = require('../models/Post');

const PostController = {
  createPost: async (req, res) => {
    const { content } = req.body;

    const authorId = req.user.userId;

    if (!content) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      const post = new Post({
        content,
        author: authorId,
      });

      await post.save();
      console.log('Post saved:', post);

      await User.findByIdAndUpdate(authorId, { $push: { posts: post._id } });

      const postResponse = post.toObject();
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

      const postWithLikeInfo = posts.map((post) => ({
        ...post.toObject(),
        likedByUser: post.likes.some((like) => like.equals(userId)),
      }));

      res.json(postWithLikeInfo);
    } catch (error) {
      console.error('Error in getAllPosts: ', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  getPostById: async (req, res) => {
    res.send('getPostById');
  },
  deletePost: async (req, res) => {
    res.send('deletePost');
  },
};

module.exports = PostController;
