const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message, err);
  console.log('Unhandled Rejection! Shutting down...');
  process.exit(1);
});

dotenv.config({ path: './src/.env' });
const app = require('./app');

if (!process.env.DATABASE) {
  console.log('Error! DATABASE environment variable not found.');
  process.exit(1);
}

const DB = process.env.DATABASE;

mongoose
  .connect(DB)
  .then((con) => {
    console.log('DB connections successful');
  })
  .catch((err) => {
    console.log('ERR: ', err);
  });

const port = process.env.PORT || 5000;
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

process.on('SIGTERM', () => {
  console.log('SIGTERM RECEIVED! Shutting down...');
  server.close(() => {
    console.log('Process terminated!');
  });
});
