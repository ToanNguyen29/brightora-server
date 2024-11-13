const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  title: {
    type: String,
    required: [true, 'Please tell userId']
  },
  thumbnail: String,
  price: { type: Number, default: 0 },
  owner_name: String,
  buying: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  duration: String
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
