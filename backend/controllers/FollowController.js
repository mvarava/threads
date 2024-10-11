const Follow = require('../models/Follow');

const FollowController = {
  followUser: async (req, res) => {
    const { followingId } = req.body;
    const userId = req.user.userId;

    if (followingId === userId) {
      return res.status(400).json({ error: 'You cannnot follow yourself' });
    }

    try {
      const existingSubscribtion = await Follow.findOne({
        follower: userId,
        following: followingId,
      });

      if (existingSubscribtion) {
        return res.status(400).json({ error: 'Subscription already exists' });
      }

      const newSubsciption = new Follow({
        follower: userId,
        following: followingId,
      });
      await newSubsciption.save();

      res.status(201).json({ message: 'Subscription is successfull' });
    } catch (error) {
      console.error('Error in followUser: ', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  unfollowUser: async (req, res) => {
    const { followingId } = req.body;
    const userId = req.user.userId;

    try {
      const existingSubscribtion = await Follow.findOne({
        follower: userId,
        following: followingId,
      });

      if (!existingSubscribtion) {
        return res.status(400).json({ error: 'You are not following' });
      }

      await Follow.findOneAndDelete({
        follower: userId,
        following: followingId,
      });

      res.status(204).json({ message: 'Unsubscription is successfull' });
    } catch (error) {
      console.error('Error in unfollowUser: ', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

module.exports = FollowController;
