const { Consumer } = require('@capstoneproject2024/common');
const Course = require('../../../models/courseModel');

const handleCourseUpdated = async (message) => {
  console.log(`Handling course.updated event: ${message}`);
  const { type, data } = JSON.parse(message);
  console.log(type, data);
  if (type !== 'course_created') {
    console.log('No course_created');
  } else {
    try {
      await Course.findByIdAndUpdate(data._id, {
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

const courseUpdatedConsumer = async () => {
  const exchange = 'capstone_course_exchange';
  const queue = 'cart_course_updated_queue';
  const routingKey = 'course_updated';
  const type = 'direct';

  try {
    const consumer = new Consumer(exchange, queue, routingKey, type);

    await consumer.connect();
    await consumer.listen(handleCourseUpdated);
  } catch (error) {
    console.error('Error starting Course updated listener:', error);
  }
};

module.exports = courseUpdatedConsumer;
