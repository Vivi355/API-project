const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');

// validating login request body
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// check keys and validate them
// check whether or not req.body.credential and req.body.password are empty
const validateLogin = [
  check('credential')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Please provide a valid email or username.'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a password.'),
  handleValidationErrors
];

// Log in
router.post('/', validateLogin, async (req, res, next) => {
    const { credential, password } = req.body;

    const user = await User.unscoped().findOne({
        where: {
            // either by username or email
          [Op.or]: {
            username: credential,
            email: credential
          }
        }
      });

      if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
        const err = new Error('Login failed');
        err.status = 401;
        err.title = 'Login failed';
        err.errors = { credential: 'The provided credentials were invalid.' };
        return next(err);
      }

      const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
      };

      await setTokenCookie(res, safeUser);

      return res.json({
        user: safeUser
      });
});

// log out --> remove token cookie from the response and return message
router.delete('/', (_req, res) => {
    res.clearCookie('token');
    return res.json({ message: 'success' });
});

// Restore session user
// if there is not a session, return a JSON with an empty object
router.get('/',(req, res) => {
    const { user } = req;
    if (user) {
        const safeUser = {
          id: user.id,
          email: user.email,
          username: user.username,
        };
        return res.json({
          user: safeUser
        });
      } else return res.json({ user: null });
    }
);



module.exports = router;
