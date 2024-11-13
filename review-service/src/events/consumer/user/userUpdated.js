const { Consumer } = require("@capstoneproject2024/common");
const User = require("../../../models/userModel");

const handleUserUpdated = async (message) => {
  console.log(`Handling user.updated event: ${message}`);
  const { type, data } = JSON.parse(message);
  console.log(type, data);
  if (type !== "user_created") {
    console.log("No user_created");
  } else {
    try {
      await User.findByIdAndUpdate(data._id, {
        firstName: data.firstName,
        lastName: data.lastName,
        photo: data.photo,
      });
    } catch (error) {
      console.log(error);
    }
  }
};

const userUpdatedConsumer = async () => {
  const exchange = "capstone_user_exchange";
  const queue = "review_user_updated_queue";
  const routingKey = "user_updated";
  const type = "direct";

  try {
    const consumer = new Consumer(exchange, queue, routingKey, type);

    await consumer.connect();
    await consumer.listen(handleUserUpdated);
  } catch (error) {
    console.error("Error starting user updated listener:", error);
  }
};

module.exports = userUpdatedConsumer;
