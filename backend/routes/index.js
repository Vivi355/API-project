
const express = require('express');
const router = express.Router();
const apiRouter = require('./api');

// all the URLs of the routes in the api router will be prefixed with /api
router.use('/api', apiRouter);

// Add a XSRF-TOKEN cookie -> allow any developer to re-set the CSRF token cookie XSRF-TOKEN
router.get("/api/csrf/restore", (req, res) => {
    const csrfToken = req.csrfToken();
    res.cookie("XSRF-TOKEN", csrfToken);
    res.status(200).json({
      'XSRF-Token': csrfToken
    });
  });

module.exports = router;
