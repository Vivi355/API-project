const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const { restoreUser } = require('../../utils/auth.js');
const spotsRouter = require('./spots.js');
const reviewsRouter = require('./reviews.js');
const spotImagesRouter = require('./spot-images.js');
const reviewImagesRouter = require('./review-images.js')

// Connect restoreUser middleware to the API router
// if current user session is valid, set req.user to the user in the database
// if current user session is not valid, set req.user to null
router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

// use spot router
router.use('/spots', spotsRouter);

// use review router
router.use('/reviews', reviewsRouter);

// use spot-images router
router.use('/spot-images', spotImagesRouter);

// use review-images router
router.use('/review-images', reviewImagesRouter);

router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

module.exports = router;
