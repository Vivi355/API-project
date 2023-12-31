const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User } = require('../db/models');

const { secret, expiresIn } = jwtConfig;

// setting the JWT cookie after a user is logged in or signed up
// setTokenCookie --> used in the login and sign up routes
const setTokenCookie = (res, user) => {
    // create the token
    // payload -> user id, email, username
    const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
  };
    const token = jwt.sign(
        { data: safeUser },
        secret,
        { expiresIn: parseInt(expiresIn) } // 604,800 seconds = 1 week
    );

    const isProduction = process.env.NODE_ENV === 'production';

    // set the token cookie
    res.cookie('token', token, {
        maxAge: expiresIn * 1000, // in milliseconds
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction && "LAX"
    });

    return token;
};

// restoreUser --> check if there is a current user logged in or not
// restore the session user based on the contents of the JWT cookie
const restoreUser = (req, res, next) => {
    // token parsed from cookies
    const { token } = req.cookies;
    req.user = null;

    return jwt.verify(token, secret, null, async (err, jwtPayload) => {
      if (err) {
        return next();
      }

      try {
        const { id } = jwtPayload.data;
        req.user = await User.findByPk(id, {
          attributes: {
            include: ['email', 'createdAt', 'updatedAt']
          }
        });
      } catch (e) {
        res.clearCookie('token');
        return next();
      }

      if (!req.user) res.clearCookie('token');

      return next();
    });
};

// requireAuth --> requiring a session user to be authenticated before accessing a route
// connect to route handlers where there needs to be a current user logged in for the actions in those route handlers
// If there is no current user, return an error
const requireAuth = function (req, _res, next) {
    if (req.user) return next();

    const err = new Error('Authentication required');
    err.title = 'Authentication required';
    err.errors = { message: 'Authentication required' };
    err.status = 401;
    return next(err);
}

// export
module.exports = { setTokenCookie, restoreUser, requireAuth };
