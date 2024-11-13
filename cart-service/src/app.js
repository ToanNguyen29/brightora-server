const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const cartRoute = require(`./routes/cartRoute`);
const { AppError } = require('@capstoneproject2024/common');
const { errGlobalHandler } = require('@capstoneproject2024/common');

const app = express();

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser, reading data from the body request (req.body)
app.use(express.json());

app.use(cookieParser());
// Serving static files
app.use(express.static(`${__dirname}/public`));

app.use(
  cors({
    origin: [
      process.env.CLIENT_URL,
      'https://localhost:3000',
      'https://capstoneproject.com',
      'http://capstoneproject.com'
    ],
    credentials: true
  })
);

// ROUTE
app.use('/api/v1/carts', cartRoute);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} in the server`, 404));
});

app.use(errGlobalHandler);

module.exports = app;
