const express = require('express');
const {requireAuth} = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const {Spot, SpotImage, Review, User, ReviewImage } = require('../../db/models');

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
    let hasPreview = false; // set the preview to false

    spotData.SpotImages.forEach(image => {
        if (image.preview === true) {
          previewImage = image.url;
          hasPreview = true; // flip to true
        }
      });

      // check if it's true or false, true with the image url, false with msg
      spotData.previewImage = hasPreview ? previewImage : 'No preview image found!';

      delete spotData.Reviews;
      delete spotData.SpotImages;

      spotList.push(spotData);
    });

    return spotList;
  };

  //////////////////////////////////////////////////////// check validation when create or edit spot
  const validateCreateSpot = [
    check('address')
        .exists({checkFalsy: true})
        .notEmpty()
        .withMessage('Street address is required'),
    check('city')
        .exists({checkFalsy: true})
        .isLength({min: 2})
        .withMessage('min 2 characters')
        .notEmpty()
        .withMessage('City is required'),
    check('state')
        .exists({checkFalsy: true})
        .isLength({min: 2})
        .withMessage('min 2 characters')
        .notEmpty()
        .withMessage('State is required'),
    check('country')
        .exists({checkFalsy: true})
        .isLength({min: 3})
        .withMessage('min 3 characters')
        .notEmpty()
        .withMessage('Country is required'),
    check('lat')
        .exists({checkFalsy: true})
        .isFloat({min: -90, max: 90})
        .withMessage('Latitude is not valid'),
    check('lng')
        .exists({checkFalsy: true})
        .isFloat({min: -180, max: 180})
        .withMessage('Longitude is not valid'),
    check('name')
        .exists({checkFalsy: true})
        .isLength({min: 3, max: 50})
        .withMessage('Name must be between 3 and 50 characters'),
    check('description')
        .exists({checkFalsy: true})
        .notEmpty()
        .withMessage('Description is required'),
    check('price')
        .exists({checkFalsy: true})
        .notEmpty()
        .withMessage('Price per day is required'),
        handleValidationErrors
];

const validateReview = [
    check('review')
        .exists({checkFalsy: true})
        .notEmpty()
        .withMessage('Review text is required'),
    check('stars')
        .exists({checkFalsy:true})
        .isInt({min: 1, max: 5})
        .withMessage('Stars must be an integer from 1 to 5'),
        handleValidationErrors
]

  /////////////////////////////////////////////////////////
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

    const Spots = updatedSpot(spots);
    return res.json({Spots});
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
    const Spots = updatedSpot(spots);
    return res.json({Spots});
});

/////////////////////////////////////////////////////////////
// add an img to a spot based on id
router.post('/:spotId/images', requireAuth, async(req, res) => {
    const { url, preview} = req.body;
    const spotId = await Spot.findByPk(req.params.spotId);

    // check spot exist
    if(!spotId) {
        res.status(404);
        return res.json({messgae: "Spot couldn't be found"});
    }
    const newImg = await SpotImage.create({
        spotId: spotId.id,
        url,
        preview
    })
    const {id} = newImg; // get the id from the newly created img

    return res.json({id, url, preview});
});

////////////////////////////////////////////////////
/////////////////////////////////////////////
// get all reviews by a spot's id
router.get('/:spotId/reviews', async(req, res) => {
    // find the spot
    const spot = await Spot.findByPk(req.params.spotId);

    // check exists
    if (!spot) {
        res.status(404);
        return res.json({"message": "Spot couldn't be found"});
    }

    const Reviews = await Review.findAll({
        include: [
            {model: User, attributes: ['id', 'firstName', 'lastName']},
            {model: ReviewImage}
        ],
        where: {
            spotId: spot.id
        }
    })

    return res.json({Reviews});
})

//////////////////////////////////////////////////////
// create a review for a spot based on spot id
router.post('/:spotId/reviews', requireAuth, validateReview, async(req, res) => {
    // find the spot id
    const spot = await Spot.findByPk(req.params.spotId);
    // get user id
    const userId = req.user.id;
    const { review, stars} = req.body;

    // check spot exists
    if (!spot) {
        res.status(404);
        return res.json({"message": "Spot couldn't be found"});
    }

    // check if the user has a review for the spot
    const hasReview = await Review.findOne({
        where: {
            spotId: spot.id,
            userId: userId
        }
    });
    // if exist handle error
    if(hasReview) {
        res.status(403);
        return res.json({"message": "User already has a review for this spot"});
    }

    // create new review for the spot
    const newReview = await Review.create({
        spotId: spot.id,
        userId,
        review,
        stars
    })

    return res.status(201).json(newReview);
})



///////////////////////////////////////////////////////////////
// edit a spot
router.put('/:spotId', requireAuth, validateCreateSpot, async(req, res) => {
    const {address, city, state, country, lat, lng, name, description, price} = req.body;
    // find the spot first
    const spot = await Spot.findByPk(req.params.spotId);

    // if no spot
    if (!spot) {
        res.status(404);
        return res.json({messgae: "Spot couldn't be found"});
    }

    spot.address = address
    spot.city = city
    spot.state = state
    spot.country = country
    spot.lat = lat
    spot.lng = lng
    spot.name = name
    spot.description = description
    spot.price = price

    await spot.save();
    return res.json(spot);
});

//////////////////////////////////////////////////////////////
// delete a spot
router.delete('/:spotId', requireAuth, async(req, res) => {
    //find the spot
    const spot = await Spot.findByPk(req.params.spotId);

    // check exist
    if (!spot) {
        res.status(404);
        return res.json({messgae: "Spot couldn't be found"});
    } else {
        await spot.destroy();
    }

    return res.json({"message": "Successfully deleted"});

})

///////////////////////////////////////////////////////////////
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
});
/////////////////////////////////////////////////////////////////
// create a spot
router.post('/', requireAuth, validateCreateSpot, async(req, res) => {
    const {address, city, state, country, lat, lng, name, description, price} = req.body;
    const ownerId = req.user.id;

    const newSpot = await Spot.create({
        ownerId,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price,
        // avgRating: 0,
        // previewImage: false
    })

    return res.status(201).json(newSpot);
});

////////////////////////////////////////////////////////

module.exports = router;
