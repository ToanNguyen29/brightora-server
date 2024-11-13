const Cart = require('./../models/cartModel');
const {
  factory,
  catchAsync,
  AppError
} = require('@capstoneproject2024/common');

// post carts/items
exports.addItem = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const courseId = req.body.courseId;

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({ user: userId });
  }

  if (cart.courses.includes(courseId)) {
    return next(new AppError('Item already in cart', 409));
  }

  cart.courses.push(courseId);
  await (await cart.save()).populate({ path: 'courses' });

  res.status(200).json({
    status: 'success',
    data: cart
  });
});

// delete carts/items/itemId
exports.deleteItem = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return next(new AppError('Cart not found', 404));
  }

  const courseId = req.params.courseId;
  cart.courses = cart.courses.filter((id) => id.toString() !== courseId);

  await cart.save();

  await cart.populate('courses');

  console.log(cart);

  res.status(200).json({
    status: 'success',
    data: cart
  });
});

// get carts/cartMe
exports.getCartMe = catchAsync(async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.user.id }).populate('courses');

  if (!cart) {
    cart = await Cart.create({ user: req.user.id });
    await cart.populate('courses');
  }

  res.status(200).json({
    status: 'success',
    quantity: cart.courses.length || 0,
    data: cart
  });
});

// Admin
exports.getAllCarts = factory.getAll(Cart);
exports.getCart = factory.getOne(Cart);
exports.createCart = factory.createOne(Cart);
exports.updateCart = factory.updateOne(Cart);
exports.deleteCart = factory.deleteOne(Cart);
