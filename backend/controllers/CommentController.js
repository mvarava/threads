// const bcrypt = require('bcryptjs');
// const JDentIcon = require('jdenticon');
// const path = require('path');
// const fs = require('fs');
// const jwt = require('jsonwebtoken');
// const mongoose = require('mongoose');

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
    const { id } = req.params;
    const userId = req.user.userId;

    try {
      const commentToDelete = await Comment.findById(id);

      if (!commentToDelete) {
        return res.status(404).json({ error: 'Such comment was not found' });
      }

      if (!commentToDelete.user.equals(userId)) {
        return res.status(403).json({ error: 'No permission' });
      }

      await Comment.findByIdAndDelete(id);

      res.status(200).json({ message: 'Comment was deleted successfully' });
    } catch (error) {
      console.error('Error in deletePost: ', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

module.exports = CommentController;
