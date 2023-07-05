const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const routes = require('./routes');
const { ValidationError } = require('sequelize'); // sequelize error handler

// isProduction will be true if the environment is in production or not by checking the environment key in the config file
const { environment } = require('./config');
const isProduction = environment === 'production';

// init the express application
const app = express();

// connect the morgan middleware for logging info about requests and responses
app.use(morgan('dev'));

// add cookir-parser middleware for parsing cookie
// add express.json middleware for parsing JSON bodies (Content-Type = 'application/json)
app.use(cookieParser());
app.use(express.json());

//******************** security middlewares ***********************//
if (!isProduction) {
    // enable cors only in development
    app.use(cors());
  }

// helmet helps set a variety of headers to better secure app
app.use(
    helmet.crossOriginResourcePolicy({
      policy: "cross-origin"
    })
);

// set the _csurf token and create req.csurfToken method
app.use(
    csurf({
      cookie: {
        secure: isProduction,
        sameSite: isProduction && "Lax",
        httpOnly: true
      }
    })
);

//connecting the exported router
app.use(routes); // connect all the routes

//*********************** Error Handling ********************************//
// catch any unhandle requests and forward to error handler
app.use((_req, _res, next) => {
    const err = new Error("The requested resource couldn't be found.");
    err.title = "Resource Not Found";
    err.errors = { message: "The requested resource couldn't be found." };
    err.status = 404;
    next(err);
});

// Process sequelize errors -> catching Sequelize errors and formatting them before sending the error response
app.use((err, _req, _res, next) => {
    // check if error is a Sequelize error:
    if (err instanceof ValidationError) {
        let errors = {};
        for (let error of err.errors) {
          errors[error.path] = error.message;
        }
        err.title = 'Validation error';
        err.errors = errors;
      }
      next(err);
});

// Error formatter -> for formatting all the errors before returning a JSON response
// include: error message(JSON object with key-value pairs), error stack trace with status code
app.use((err, _req, res, _next) => {
    res.status(err.status || 500);
    console.error(err);
    res.json({
      title: err.title || 'Server Error',
      message: err.message,
      errors: err.errors,
      stack: isProduction ? null : err.stack
    });
  });

// export app
module.exports = app;
