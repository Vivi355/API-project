const router = require('express').Router();
const { restoreUser } = require('../../utils/auth.js');

// Connect restoreUser middleware to the API router
// if current user session is valid, set req.user to the user in the database
// if current user session is not valid, set req.user to null
router.use(restoreUser);

module.exports = router;
