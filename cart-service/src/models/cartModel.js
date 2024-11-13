const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString()
    },
    user: {
      type: String,
      required: [true, 'Please tell userId']
    },
    courses: [
      {
        type: String,
        ref: 'Course',
        default: []
      }
    ]
  },
  {
    toObject: {
      virtuals: true,
      versionKey: false
    },
    toJSON: {
      virtuals: true,
      versionKey: false
    },
    id: false
  }
);

cartSchema.index({ user: 1 });

cartSchema.virtual('priceCart').get(function () {
  if (!this.courses) return 0;

  const totalPrice = this.courses.reduce((acc, course) => {
    return acc + (course.price || 0);
  }, 0);

  return totalPrice;
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
