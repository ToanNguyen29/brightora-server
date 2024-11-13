const mongoose = require('mongoose');
const Course = require('./courseModel');
const { ratingUpdated } = require('../events/publisher/reviewPublisher');

const reviewSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString()
    },
    review: {
      type: String,
      required: [true, 'Review can not be empty!']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    course: {
      type: String,
      ref: 'Course',
      required: [true, 'Review must belong to a course.']
    },
    user: {
      type: String,
      ref: 'User',
      required: [true, 'Review must belong to a user']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false
  }
);

reviewSchema.index({ course: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'firstName lastName photo'
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (courseId) {
  const stats = await this.aggregate([
    {
      $match: { course: courseId }
    },
    {
      $group: {
        _id: '$courseId',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  console.log(stats);

  if (stats.length > 0) {
    const course = await Course.findByIdAndUpdate(courseId, {
      ratingsQuantity: stats[0].nRating,
      rating: stats[0].avgRating
    });
    await ratingUpdated(course);
  } else {
    await Course.findByIdAndUpdate(courseId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    });
  }
};

reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.course);
});

// findByIdAndUpdate
// findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();

  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  // await this.findOne(); does NOT work here, query has already executed
  await this.r.constructor.calcAverageRatings(this.r.course);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
