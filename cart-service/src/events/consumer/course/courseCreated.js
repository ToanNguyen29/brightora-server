const { Consumer } = require('@capstoneproject2024/common');
const Course = require('../../../models/courseModel');

const handleCourseCreated = async (message) => {
  console.log(`Handling course.created event: ${message}`);
  const { type, data } = JSON.parse(message);
  console.log(type, data);
  if (type !== 'course_created') {
    console.log('No course_created');
  } else {
    try {
      await Course.create({
        _id: data._id,
        title: data.title,
        thumbnail: data.thumbnail,
        owner_name: data.owner_name,
        price: data.price,
        rating: data.rating,
        buying: data.buying,
        duration: data.duration
      });
    } catch (error) {
      console.log(error);
    }
  }
};

const courseCreatedConsumer = async () => {
  try {
    const consumer = new Consumer(
      'capstone_course_exchange',
      'cart_course_created_queue',
      'course_created'
    );

    await consumer.connect();
    await consumer.listen(handleCourseCreated);
  } catch (error) {
    console.error('Error starting Course created listener:', error);
  }
};

module.exports = courseCreatedConsumer;
