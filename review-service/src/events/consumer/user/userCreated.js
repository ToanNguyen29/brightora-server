const { Consumer } = require("@capstoneproject2024/common");
const User = require("../../../models/userModel");

const handleUserCreated = async (message) => {
  console.log(`Handling user.created event: ${message}`);
  const { type, data } = JSON.parse(message);
  console.log(type, data);
  if (type !== "user_created") {
    console.log("No user_created");
  } else {
    try {
      await User.create({
        _id: data._id,
        firstName: data.firstName,
        lastName: data.lastName,
        photo: data.photo,
      });
    } catch (error) {
      console.log(error);
    }
  }
};

const userCreatedConsumer = async () => {
  try {
    const consumer = new Consumer(
      "capstone_user_exchange",
      "review_user_created_queue",
      "user_created"
    );

    await consumer.connect();
    await consumer.listen(handleUserCreated);
  } catch (error) {
    console.error("Error starting user created listener:", error);
  }
};

module.exports = userCreatedConsumer;
