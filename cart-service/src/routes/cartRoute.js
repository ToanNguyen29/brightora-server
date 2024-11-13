const express = require('express');
const cartController = require('./../controllers/cartController');
const { protect, restrictTo } = require('@capstoneproject2024/common');

const router = express.Router();

router.route('/cartMe').get(protect, cartController.getCartMe);
router.route('/item').post(protect, cartController.addItem);
router.route('/item/:courseId').delete(protect, cartController.deleteItem);

router.use(protect, restrictTo('admin'));
router
  .route('/')
  .get(cartController.getAllCarts)
  .post(cartController.createCart);
router
  .route('/:id')
  .get(cartController.getCart)
  .patch(cartController.updateCart)
  .delete(cartController.deleteCart);

module.exports = router;
