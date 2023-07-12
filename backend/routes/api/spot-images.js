const express = require('express');
const {requireAuth} = require('../../utils/auth');

const {SpotImage} = require('../../db/models')

const router = express.Router();

// delete a spot image for a spot
router.delete('/:imageId', requireAuth, async(req, res) => {
    // find the spotImage
    const spotImage = await SpotImage.findByPk(req.params.imageId);

    // check exists
    if (!spotImage) {
        res.status(404);
        return res.json({ "message": "Spot Image couldn't be found"});
    } else {
        await spotImage.destroy();
    }

    return res.json({"message": "Successfully deleted"})
})

module.exports = router;
