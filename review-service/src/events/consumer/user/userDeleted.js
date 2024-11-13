const { Consumer } = require("@capstoneproject2024/common");
const User = require("../../../models/userModel");

const handleUserDeleted = async (message) => {
  console.log(`Handling user.deleted event: ${message}`);
  const { type, data } = JSON.parse(message);
  console.log(type, data);
  if (type !== "user_created") {
    console.log("No user_created");
  } else {
    try {
      await User.findByIdAndDelete(data._id);
    } catch (error) {
      console.log(error);
    }
  }
};

const userDeletedConsumer = async () => {
  try {
    const consumer = new Consumer(
      "capstone_user_exchange",
      "review_user_deleted_queue",
      "user_deleted"
    );

    await consumer.connect();
    await consumer.listen(handleUserDeleted);
  } catch (error) {
    console.error("Error starting user deleted listener:", error);
  }
};

module.exports = userDeletedConsumer;
