const User = require('./../models/userModel');
const { catchAsync } = require('@capstoneproject2024/common');
const { AppError } = require('@capstoneproject2024/common');
const { factory } = require('@capstoneproject2024/common');
const multer = require('multer');
const sharp = require('sharp');
const {
  userUpdated,
  userDeleted
} = require('../events/publisher/userPublisher');

const filterData = (obj, ...allowFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  try {
    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`${__dirname}/../public/images/users/${req.file.filename}`);
  } catch (error) {
    console.log(error);
  }

  next();
});

exports.getMe = (req, res, next) => {
  console.log(req.user.id);
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password update, please use /updatePassword',
        400
      )
    );
  }

  const dataUpdate = filterData(
    req.body,
    'firstName',
    'lastName',
    'headline',
    'description',
    'googleLink',
    'websiteLink',
    'linkedInLink',
    'twitterLink',
    'facebookLink',
    'youtubeLink'
  );

  const updateUser = await User.findByIdAndUpdate(req.user.id, dataUpdate, {
    new: true,
    runValidators: true
  });

  await userUpdated(updateUser);

  res.status(200).json({
    status: 'success',
    data: updateUser
  });
});

exports.updatePhoto = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password update, please use /updatePassword',
        400
      )
    );
  }

  if (!req.file) {
    return next(new AppError('No file uploaded with request', 400));
  }

  req.body.photo = req.file.filename;
  const dataUpdate = filterData(req.body, 'photo');

  const updateUser = await User.findByIdAndUpdate(req.user.id, dataUpdate, {
    new: true
  });

  await userUpdated(updateUser);

  res.status(200).json({
    status: 'success',
    data: updateUser
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, {
    active: false
  });

  await userDeleted(req.user.id);

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    data: 'Route is not defined, please signup to create User'
  });
};
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
