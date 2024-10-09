const bcrypt = require('bcryptjs');
const JDentIcon = require('jdenticon');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const Follow = require('../models/Follow');
const Post = require('../models/Post');

const UserController = {
  register: async (req, res) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      const existingUser = await User.findOne({ email }).select('-password');
      if (existingUser) {
        return res.status(400).json({ error: 'User with entered email already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const png = JDentIcon.toPng(name, 200);
      const avatarName = `${name}_${Date.now()}.png`;
      const avatarPath = path.join(__dirname, '../uploads', avatarName);
      fs.writeFileSync(avatarPath, png);

      const user = new User({
        email,
        password: hashedPassword,
        name,
        avatarUrl: `/uploads/${avatarName}`,
      });

      await user.save();

      const userResponse = user.toObject();

      res.status(201).json(userResponse);
    } catch (error) {
      console.error('Error in register: ', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  login: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        return res.status(400).json({ error: 'Ivalid email or password' });
      }

      const isValid = await bcrypt.compare(password, existingUser.password);
      if (!isValid) {
        return res.status(400).json({ error: 'Ivalid email or password' });
      }

      const token = jwt.sign({ userId: existingUser._id }, process.env.SECRET_KEY);

      res.json({ token });
    } catch (error) {
      console.error('Error in login: ', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  getUserById: async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    try {
      const user = await User.findById(id).select('-password');

      if (!user) {
        return res.status(404).json({
          error: 'User not found',
        });
      }

      const isFollowing = await Follow.findOne({
        follower: userId,
        following: id,
      });

      const userResponse = user.toObject();

      res.json({ ...userResponse, isFollowing: Boolean(isFollowing) });
    } catch (error) {
      console.error('Error in getUserById: ', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  updateUser: async (req, res) => {
    const { id } = req.params;
    const { email } = req.body;

    let filePath;

    if (req.file && req.file.path) {
      file.path = req.file.path;
    }

    if (id !== req.user.userId) {
      return res.status(403).json({ error: 'No permission' });
    }

    try {
      if (email) {
        const existingUser = await User.findOne({ email });

        if (existingUser && existingUser.id !== id) {
          return res.status(400).json({ error: 'Email is already in use' });
        }
      }

      const updatedUser = await User.findByIdAndUpdate(
        id,
        {
          ...req.body,
          avatarUrl: filePath ? `/${filePath}` : undefined,
        },
        {
          new: true,
          runValidators: true,
        },
      ).select('-password');

      const userResponse = updatedUser.toObject();

      res.json(userResponse);
    } catch (error) {
      console.error('Error in updateUser: ', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  current: async (req, res) => {
    try {
      const userId = req.user.userId;

      const user = await User.findById(userId).select('-password');

      if (!user) {
        return res.status(400).json({ error: 'Failed to find such user' });
      }

      const posts = await Post.find({ author: userId }).sort({ createdAt: -1 });

      const userResponse = user.toObject();

      res.json({ ...userResponse, posts });
    } catch (error) {
      console.error('Error in current: ', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

module.exports = UserController;
