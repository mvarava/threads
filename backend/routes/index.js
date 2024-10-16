const express = require('express');
const router = express.Router();
const multer = require('multer');

const {
  UserController,
  PostController,
  CommentController,
  LikeController,
  FollowController,
} = require('../controllers');
const { authenticateToken } = require('../middleware/auth');

const uploadDestination = 'uploads';

// Showing where to store files
const storage = multer.diskStorage({
  destination: uploadDestination,
  filename: (req, file, next) => {
    next(null, file.originalname);
  },
});

const uploads = multer({ storage });

// User routes
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/users/:id', authenticateToken, UserController.getUserById);
router.get('/current', authenticateToken, UserController.current);
router.put('/users/:id', authenticateToken, uploads.single('avatar'), UserController.updateUser);

// Post routes
router.post('/posts', authenticateToken, PostController.createPost);
router.get('/posts', authenticateToken, PostController.getAllPosts);
router.get('/posts/:id', authenticateToken, PostController.getPostById);
router.delete('/posts/:id', authenticateToken, PostController.deletePost);

// Comment routes
router.post('/comments', authenticateToken, CommentController.createComment);
router.delete('/comments/:id', authenticateToken, CommentController.deleteComment);

// Like routes
router.post('/likes', authenticateToken, LikeController.likePost);
router.delete('/likes/:id', authenticateToken, LikeController.unlikePost);

// Follow routes
router.post('/follow', authenticateToken, FollowController.followUser);
router.delete('/unfollow', authenticateToken, FollowController.unfollowUser);

module.exports = router;
