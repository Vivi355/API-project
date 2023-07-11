const express = require('express');
const {requireAuth} = require('../../utils/auth');
const sequelize = require('sequelize')

const {Spot, SpotImage, Review, User } = require('../../db/models');

const router = express.Router();

// helper function for adding avgRating and previewImage
function updatedSpot(spots) {
    // iterating all the spots
    let spotList = [];

  spots.forEach((spot) => {
    const spotData = spot.toJSON();

    // calculate argRating
    let avgRating = 0;
    let totalReview = spotData.Reviews.length;

    spotData.Reviews.forEach(review => {
      avgRating += review.stars;
    });

    if (totalReview > 0) {
      avgRating /= totalReview;
    }

    spotData.avgRating = avgRating;

    // updating the preview to previewImage and set the url value
    let previewImage = null;
    spotData.SpotImages.forEach(image => {
      if (image.preview === true) {
        previewImage = image.url;
      }

      // if preview is false, then display msg
      if (!image.preview) {
        image.preview = 'No preview image found!'
      }
    });

    spotData.previewImage = previewImage;

    // delete unnessary part
    delete spotData.Reviews;
    delete spotData.SpotImages;

    spotList.push(spotData);
  });

  return spotList;
}

// get all spots
router.get('/', async (req, res) => {
    const spots = await Spot.findAll({
       include: [
        {
            model: Review
        },
        {
            model: SpotImage
        }
       ]
    });

    const allSpots = updatedSpot(spots)
    return res.json(allSpots)
});

// get all spots owned by the Current user
router.get('/current', requireAuth, async (req, res) => {
    const ownerId = req.user.id;
    const spots = await Spot.findAll({
        include: [
            {model: SpotImage},
            {model: Review}
        ],
           where: {
            ownerId: ownerId
           }
    })
    const ownerSpots = updatedSpot(spots)
    return res.json(ownerSpots)
});

// get details of a spot from an id
router.get('/:spotId', async(req, res) => {
    const spot = await Spot.findByPk(req.params.spotId, {
        include: [
            {model: Review},
            {model: SpotImage, attributes:['id', 'url', 'preview']},
            {model: User, as: 'Owner', attributes:['id', 'firstName', 'lastName']}
        ]
    })

    if (!spot) {
        const err = new Error("Spot couldn't be found");
        err.staus = 404;
        res.json({
            message: err.message,
            code: err.status
        })
    } else {
        // get numReviews
        const numReviews = await Review.count({
            where: {spotId: spot.id}
        })
        spot.setDataValue('numReviews', numReviews);

        // Calculate avgStarRating
        let avgStarRating = 0;
        spot.Reviews.forEach(review => {
        avgStarRating += review.stars;
        });
        if (numReviews > 0) {
        avgStarRating /= numReviews;
        }
        spot.setDataValue('avgStarRating', avgStarRating);

        // Remove Reviews
        const Spots = spot.toJSON();
        delete Spots.Reviews;

        return res.json(Spots);
    }
})

module.exports = router;
