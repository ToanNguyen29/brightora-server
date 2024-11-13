const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString(),
    },
    rating: { type: Number, default: 4.5 },
    ratingsQuantity: { type: Number, default: 0 },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
  }
);

courseSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "course",
  localField: "_id",
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
