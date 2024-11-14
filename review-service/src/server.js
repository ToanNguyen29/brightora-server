const mongoose = require('mongoose');

// const dotenv = require("dotenv");
// dotenv.config({ path: "./src/.env" });

const app = require('./app');
const courseDeletedConsumer = require('./events/consumer/course/courseDeleted');
const courseCreatedConsumer = require('./events/consumer/course/courseCreated');
const userCreatedConsumer = require('./events/consumer/user/userCreated');
const userUpdatedConsumer = require('./events/consumer/user/userUpdated');
const userDeletedConsumer = require('./events/consumer/user/userDeleted');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message, err);
  console.log('Unhandled Rejection! Shutting down...');

  process.exit(1);
});

if (!process.env.DATABASE) {
  console.log('Error: DATABASE environment variable not found.');
  process.exit(1);
}

const DB = process.env.DATABASE;

console.log(DB);

mongoose
  .connect(DB)
  .then((con) => {
    // console.log(con.connections);
    console.log('DB connections successful!');
  })
  .catch((err) => {
    console.log('ERR: ', err);
  });

(async () => {
  await courseDeletedConsumer();
  await courseCreatedConsumer();
  await userCreatedConsumer();
  await userUpdatedConsumer();
  await userDeletedConsumer();
})();

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`App running on port: ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandled Rejection! Shutting down...');

  // Close server trước khi shut down application
  server.close(() => {
    process.exit(1);
  });
});
