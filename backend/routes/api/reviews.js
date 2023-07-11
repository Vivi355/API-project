const express = require('express');
const {requireAuth} = require('../../utils/auth');

const {Review, Spot, ReviewImage, User} = require('../../db/models');

const router = express.Router();

// get reviews of current user
router.get('/current', requireAuth, async (req, res) => {
    const userId = req.user.id;
    const Reviews = await Review.findAll({
        include: [
            {model: User, attributes: ['id', 'firstName', 'lastName']},
            {model: Spot, attributes:['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price']},
            {model: ReviewImage, attributes: ['id', 'url']}
        ],
        where: {
            userId:userId
        }
    })

    // add previewImage to the spot
    // iterate the review and update it
    const addToReview =  Reviews.map(review => {
        const reviewJson = review.toJSON();

        const spotData = reviewJson.Spot; // refer to spot
        let previewImage = null;
        let hasPreview = false;

        // check if exist AND is array
        if (spotData && Array.isArray(spotData.SpotImages)) {
            spotData.SpotImages.forEach(image => {
              if (image.preview === true) {
                previewImage = image.url;
                hasPreview = true;
              }
            });
          }

        spotData.previewImage = hasPreview ? previewImage : 'No preview image found!';
        // return updated version of the review
        return reviewJson;
    })

    return res.json({Reviews: addToReview});
})

////////////////////////////////////////////////////
// add image to review based on review id
router.post('/:reviewId/images', requireAuth, async(req, res) => {
    const {url} = req.body;
    // find the review
    const review = await Review.findByPk(req.params.reviewId);

    // check exist
    if (!review) {
        res.status(404);
        return res.json({"message": "Review couldn't be found"});
    }

    const maxImg = 10;
    // count review image
    const imgCount = await ReviewImage.count({
        where: {reviewId: review.id}
    })

    // compare count with max
    if (imgCount >= maxImg) {
        res.status(403);
        return res.json({ "message": "Maximum number of images for this resource was reached"});
    }

    // create new image for review
    const newReImg = await ReviewImage.create({
        reviewId: review.id,
        url
    })
    const {id} = newReImg;
    // will return id and url only
    return res.json({id, url});
})


module.exports = router;
