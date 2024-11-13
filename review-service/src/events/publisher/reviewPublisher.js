const { Publisher } = require('@capstoneproject2024/common');

exports.ratingUpdated = async (updatedRatingCourse) => {
  const publisher = new Publisher('capstone_review_exchange', 'rating_updated');
  await publisher.connect();
  await publisher.publish({
    type: 'rating_updated',
    data: updatedRatingCourse
  });
  await publisher.close();
};
