const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const compression = require('compression');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRoute = require(`./routes/userRoute`);
const { AppError } = require('@capstoneproject2024/common');
const { errGlobalHandler } = require('@capstoneproject2024/common');

const app = express();

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json()); // chuyển đổi req.body thành dạng đối tượng javascript
app.use(express.urlencoded({ extended: true, limit: '20kb' }));
app.use(express.static(`${__dirname}/public`)); // Serving static files

app.use(cookieParser());
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(compression());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

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
app.use('/api/v1/users', userRoute);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} in the server`, 404));
});

app.use(errGlobalHandler);

module.exports = app;
