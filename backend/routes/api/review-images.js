const express = require('express');
const {requireAuth} = require('../../utils/auth');

const {ReviewImage} = require('../../db/models');

const router = express.Router();

// delete a review image for a Review
router.delete('/:imageId', requireAuth, async(req, res) => {
    // find the review image
    const reviewImage = await ReviewImage.findByPk(req.params.imageId);

    // check exists
    if(!reviewImage) {
        res.status(404);
        return res.json({"message": "Review Image couldn't be found"})
    } else {
        await reviewImage.destroy();
    }

    return res.json({"message": "Successfully deleted"})
})

module.exports = router;
