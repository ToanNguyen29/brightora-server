const express = require('express');
const userController = require('../controllers/userController');
const authController = require('./../controllers/authController');
const { protect, restrictTo } = require('@capstoneproject2024/common');

const router = express.Router();

router.route('/signup').post(authController.signUp);
router.route('/login').post(authController.login);

router.route('/forgotPass').post(authController.forgotPass);
router.route('/resetPassword/:token').patch(authController.resetPass);

router.route('/auth/google').get(authController.googleAuthHandler);
router.route('/auth/facebook').post(authController.facebookAuthHandler);
router.route('/auth/github').get(authController.githubAuthHandler);

router.use(protect);
router.post('/logout', authController.logout);
router.route('/me').get(userController.getMe, userController.getUser);
router.route('/updateMe').patch(userController.updateMe);
router
  .route('/updatePhoto')
  .patch(
    userController.uploadUserPhoto,
    userController.resizeUserPhoto,
    userController.updatePhoto
  );

router.route('/deleteMe').delete(userController.deleteMe);
router.route('/updatePassword').patch(authController.updatePassword);

router.use(restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
