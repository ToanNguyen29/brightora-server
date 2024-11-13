const { Publisher } = require('@capstoneproject2024/common');

exports.userCreated = async (newUser) => {
  const publisher = new Publisher('capstone_user_exchange', 'user_created');
  await publisher.connect();
  await publisher.publish({
    type: 'user_created',
    data: newUser
  });
  await publisher.close();
};

exports.userUpdated = async (updatedUser) => {
  const publisher = new Publisher('capstone_user_exchange', 'user_updated');
  await publisher.connect();
  await publisher.publish({
    type: 'user_updated',
    data: updatedUser
  });
  await publisher.close();
};

exports.userDeleted = async (deletedUserId) => {
  const publisher = new Publisher('capstone_user_exchange', 'user_deleted');
  await publisher.connect();
  await publisher.publish({
    type: 'user_deleted',
    data: deletedUserId
  });
  await publisher.close();
};
