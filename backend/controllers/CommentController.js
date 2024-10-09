// const bcrypt = require('bcryptjs');
// const JDentIcon = require('jdenticon');
// const path = require('path');
// const fs = require('fs');
// const jwt = require('jsonwebtoken');

const User = require('../models/User');
const Follow = require('../models/Follow');
const Comment = require('../models/Comment');
const Post = require('../models/Post');

const CommentController = {
  createComment: async (req, res) => {
    const { postId, content } = req.body;
    const userId = req.user.userId;

    if (!postId || !content) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      const post = await Post.findById(postId);

      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      const newComment = new Comment({
        content,
        user: userId,
        post: postId,
      });

      await newComment.save();

      post.comments.push(newComment._id);
      await post.save();

      const commentResponse = newComment.toObject();
      res.status(201).json(commentResponse);
    } catch (error) {
      console.error('Error in createComment: ', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  deleteComment: async (req, res) => {
    res.send('deleteComment');
  },
};

module.exports = CommentController;
