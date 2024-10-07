const bcrypt = require('bcryptjs');
const JDentIcon = require('jdenticon');
const path = require('path');
const fs = require('fs');

const User = require('../models/User');

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
      console.error('Error in register:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  login: async (req, res) => {
    res.send('login');
  },
  getUserById: async (req, res) => {
    res.send('getUserById');
  },
  updateUser: async (req, res) => {
    res.send('updateUser');
  },
  current: async (req, res) => {
    res.send('current');
  },
};

module.exports = UserController;
