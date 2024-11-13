const { Consumer } = require("@capstoneproject2024/common");
const Course = require("../../../models/courseModel");

const handleCourseDeleted = async (message) => {
  console.log(`Handling course.deleted event: ${message}`);
  const { type, data } = JSON.parse(message);
  console.log(type, data);
  if (type !== "course_created") {
    console.log("No course_created");
  } else {
    try {
      await Course.findByIdAndDelete(data.id);
    } catch (error) {
      console.log(error);
    }
  }
};

const courseDeletedConsumer = async () => {
  try {
    const consumer = new Consumer(
      "capstone_course_exchange",
      "review_course_deleted_queue",
      "course_deleted"
    );

    await consumer.connect();
    await consumer.listen(handleCourseDeleted);
  } catch (error) {
    console.error("Error starting Course deleted listener:", error);
  }
};

module.exports = courseDeletedConsumer;
