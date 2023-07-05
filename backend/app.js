const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const routes = require('./routes');

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

//////////////////// security middlewares /////////////////////////
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

// export app
module.exports = app;
