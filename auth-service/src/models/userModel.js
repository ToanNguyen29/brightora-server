const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { userDeleted } = require('../events/publisher/userPublisher');

const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  firstName: {
    type: String,
    trim: true,
    required: [true, 'Please tell us your first name']
  },
  lastName: {
    type: String,
    trim: true,
    required: [true, 'Please tell us your last name']
  },
  email: {
    type: String,
    required: [true, 'Please provide your emal'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  photo: {
    type: String,
    default: 'default.jpg'
  },
  headline: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  googleLink: {
    type: String,
    trim: true,
    default: ''
  },
  facebookLink: {
    type: String,
    trim: true,
    default: ''
  },
  websiteLink: {
    type: String,
    trim: true,
    default: ''
  },
  twitterLink: {
    type: String,
    trim: true,
    default: ''
  },
  linkedInLink: {
    type: String,
    trim: true,
    default: ''
  },
  youtubeLink: {
    type: String,
    trim: true,
    default: ''
  },
  role: {
    type: String,
    enum: ['student', 'instructor', 'admin'],
    default: 'student'
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlenght: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE and SAVE
      validator: function (value) {
        return value === this.password;
      },
      message: 'Passwords are not the same'
    }
  },
  DateChangePass: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  },
  authType: {
    type: String,
    enum: ['local', 'google', 'facebook', 'github'],
    default: 'local'
  },
  authGoogleId: String,
  authFacebookId: String,
  authGithubId: String
});

userSchema.pre('save', async function (next) {
  // Kiểm tra xem mật khẩu có thay đổi không nếu không thì không cần mã hóa
  if (!this.isModified('password')) return next();

  // Có thay đổi thì mã hóa bằng bcrypt with cost 12
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('active') || this.isNew) return next();
  if (this.active === false) await userDeleted(this._id);
  next();
});

userSchema.pre('save', function (next) {
  // Nếu không có thay đổi mật khẩu trong đối tượng hoặc đối tượng này là đối tượng mới thì next()
  if (!this.isModified('password') || this.isNew) return next();
  // Nếu không thỏa điều trên có nghĩa là đối tượng vừa thay đổi password nên ta sẽ update thời gian đổi password
  this.DateChangePass = Date.now();
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.checkPass = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.createPassResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
