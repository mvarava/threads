const bcrypt = require('bcryptjs');
const JDentIcon = require('jdenticon');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const Follow = require('../models/Follow');

const UserController = {
  register: async (req, res) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      const existingUser = await User.findOne({ email });
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
      delete userResponse.password;

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
      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({
          error: 'User not found',
        });
      }

      const isFollowing = await Follow.findOne({
        follower: userId,
        following: id,
      });

      const userObj = user.toObject();

      res.json({ ...userObj, isFollowing: Boolean(isFollowing) });
    } catch (error) {
      console.error('Error in getUserById: ', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  current: async (req, res) => {
    res.send('current');
  },
  updateUser: async (req, res) => {
    res.send('updateUser');
  },
};

module.exports = UserController;
