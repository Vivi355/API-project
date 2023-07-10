const express = require('express');
const {requireAuth} = require('../../utils/auth')

const {Spot, SpotImage, Review } = require('../../db/models');

const router = express.Router();

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

    // iterating all the spots
    let spotList = [];
    spots.forEach((spot) => {
        spotList.push(spot.toJSON());
    });

    // calculating avg star rating
    spotList.forEach(spot => {
        let avgRating = 0;
        let totalReview = spot.Reviews.length;
        spot.Reviews.forEach(review => {
            avgRating += review.stars;
        });
        if (totalReview > 0) {
            avgRating /= totalReview;
        }
        spot.avgRating = avgRating;
        delete spot.Reviews;
    })

    // set preview to the url value
    spotList.forEach(spot => {
     let previewImage = null;
     spot.SpotImages.forEach(image => {
            if (image.preview === true) {
                previewImage = image.url
            }
            spot.previewImage = previewImage;
            delete spot.SpotImages;
        });
    })
    return res.json(spotList)
})

module.exports = router;
