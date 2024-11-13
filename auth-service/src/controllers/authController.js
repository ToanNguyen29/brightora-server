const { AppError, Publisher } = require('@capstoneproject2024/common');
const User = require('./../models/userModel');
const { catchAsync } = require('@capstoneproject2024/common');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Email } = require('@capstoneproject2024/common');
const oauth2client = require('../utils/googleConfig');
const axios = require('axios');
const { userCreated } = require('../events/publisher/userPublisher');

// CREATE TOKEN
const createToken = (id, role) => {
  return (token = jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  }));
};

// SEND TOKEN
const createSendToken = async (statusCode, user, res, isRedirect) => {
  const token = createToken(user._id, user.role);

  const cookieOption = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    path: '/'
  };

  if (process.env.NODE_ENV === 'production') {
    cookieOption.secure = true;
  }

  res.cookie('jwt', token, cookieOption);

  if (isRedirect) {
    res.redirect(process.env.CLIENT_URL + '/');
  } else {
    res.status(statusCode).json({
      status: 'success',
      data: user
    });
  }
};

// SIGN UP
exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  await userCreated(newUser);
  createSendToken(201, newUser, res);
});

// LOGIN
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new AppError('Invalid email or password', 401));
  }

  if (!user.password) {
    return next(new AppError('Invalid email or password', 401));
  }

  if (!(await user.checkPass(password, user.password))) {
    return next(new AppError('Invalid email or password', 401));
  }

  createSendToken(201, user, res);
});

// LOGOUT
exports.logout = (req, res, next) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
};

// FORGOT PASSWORD
exports.forgotPass = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with email address', 404));
  }

  const resetToken = user.createPassResetToken();
  await user.save({ validateBeforeSave: false });

  try {
    const resetURL = `${process.env.CLIENT_URL}/resetpassword/${resetToken}`;

    await new Email(user, resetURL).send(
      `${__dirname}/../views/email/passwordReset.pug`,
      'Now you can reset your account password (valid for only 10 minutes)'
    );

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email'
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again later', 500)
    );
  }
});

// RESET PASSWORD
exports.resetPass = catchAsync(async (req, res, next) => {
  const hashToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  createSendToken(201, user, res);
});

// UPDATE PASSWORD
exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).select('+password');

  if (
    !user ||
    !(await user.checkPass(req.body.passwordCurrent, user.password))
  ) {
    return next(new AppError('Your current password is not correct', 401));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  createSendToken(200, user, res);
});

// GOOGLE LOGIN
exports.googleAuthHandler = catchAsync(async (req, res, next) => {
  const code = req.query.code;

  if (!code) {
    return next(new AppError('Authorization code not provided!', 401));
  }

  const googleRes = await oauth2client.getToken(code);
  oauth2client.setCredentials(googleRes.tokens);

  const userRes = await axios.get(
    `https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
  );

  const { id, email, given_name, family_name } = userRes.data;

  const user = await User.findOne({
    email: email,
    authType: 'google'
  });

  if (user) {
    createSendToken(201, user, res);
  } else {
    const newUser = new User({
      authType: 'google',
      email: email,
      authGoogleId: id,
      lastName: family_name,
      firstName: given_name
    });
    await newUser.save({ validateBeforeSave: false });
    await userCreated(newUser);
    createSendToken(201, newUser, res);
  }
});

// FACEBOOK LOGIN
exports.facebookAuthHandler = catchAsync(async (req, res, next) => {
  const { id, email, name } = req.body;

  if (!id) {
    return next(new AppError('Authorization id not provided!', 401));
  }

  const user = await User.findOne({
    authFacebookId: id,
    authType: 'facebook'
  });

  const nameParts = name.trim().split(' ');

  const firstName = nameParts[0];
  const lastName = nameParts[nameParts.length - 1];

  if (user) {
    createSendToken(201, user, res);
  } else {
    const newUser = new User({
      authType: 'facebook',
      email: email || null,
      authFacebookId: id,
      lastName: lastName,
      firstName: firstName
    });
    await newUser.save({ validateBeforeSave: false });
    await userCreated(newUser);
    createSendToken(201, newUser, res);
  }
});

// GITHUB LOGIN
exports.githubAuthHandler = catchAsync(async (req, res, next) => {
  const code = req.query.code;

  if (!code) {
    return next(new AppError('Authorization code not provided!', 401));
  }

  const resToken = await axios.post(
    `https://github.com/login/oauth/access_token?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${req.query.code}`
  );

  const accessToken = resToken.data.split('&')[0].split('=')[1];

  const resUser = await axios.get('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  const { login, id, email, name } = resUser.data;

  const user = await User.findOne({
    authGithubId: id,
    authType: 'github'
  });

  let firstName = login;
  let lastName = '';

  if (name) {
    const nameParts = name.trim().split(' ');

    firstName = nameParts[0];
    lastName = nameParts[nameParts.length - 1];
  }

  if (user) {
    createSendToken(201, user, res, true);
  } else {
    const newUser = new User({
      authType: 'github',
      email: email,
      authGithubId: id,
      lastName: lastName,
      firstName: firstName
    });
    await newUser.save({ validateBeforeSave: false });
    await userCreated(newUser);
    createSendToken(201, newUser, res, true);
  }
});
