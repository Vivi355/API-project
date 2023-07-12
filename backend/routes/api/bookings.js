const express = require('express');
const {requireAuth} = require('../../utils/auth');

const {Booking, User, Spot} = require('../../db/models')

const router = express.Router();

// get all of the Current User's booking
router.get('/current', requireAuth, async(req, res) => {
    const userId = req.user.id;
    const Bookings = await Booking.findAll({
        include: [
            {model: Spot, attributes:['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price']}
        ],
        where: {
            userId: userId
        }
    })

    // add previewImage to the spot
    // iterate the review and update it
    const addToBooking =  Bookings.map(booking => {
        const bookingJson = booking.toJSON();

        const spotData = bookingJson.Spot; // refer to spot
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

        // format the startDate and endDate
        bookingJson.startDate = bookingJson.startDate.toISOString().slice(0, 10);
        bookingJson.endDate = bookingJson.endDate.toISOString().slice(0, 10);

        // return updated version of the booking
        return bookingJson;
    })

    return res.json({Bookings: addToBooking})
})

module.exports = router;
