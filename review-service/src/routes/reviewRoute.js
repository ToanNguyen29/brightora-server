const express = require("express");
const reviewController = require("./../controllers/reviewController");
const { protect, restrictTo } = require("@capstoneproject2024/common");

const router = express.Router();

router.use(protect);

router
  .route("/:courseId/reviews")
  .get(reviewController.getAllReviews)
  .post(reviewController.setCourseUserIds, reviewController.createReview);

router
  .route("/:id")
  .get(reviewController.getReview)
  .patch(restrictTo("admin"), reviewController.updateReview)
  .delete(restrictTo("admin"), reviewController.deleteReview);

module.exports = router;
