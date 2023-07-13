const express = require('express');
const {requireAuth} = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');

const {Booking, User, Spot} = require('../../db/models')

const router = express.Router();

const validateBooking = [
    check('startDate')
        .exists({checkFalsy: true})
        .notEmpty()
        .withMessage('Must have a startDate'),
    check('endDate')
        .exists({checkFalsy: true})
        // need a custom validator to check(ref:express-validator docs)
        .custom((value, {req}) => {
            const startDate = new Date(req.body.startDate);
            const endDate = new Date(value);

            // check values
            if (endDate <= startDate) {
                throw new Error('endDate cannot be on or before startDate');
            }
            return true;
        }),
    handleValidationErrors
];

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

        // format the startDate and endDate, createdAt and updatedAt
        bookingJson.startDate = bookingJson.startDate.toISOString().slice(0, 10);
        bookingJson.endDate = bookingJson.endDate.toISOString().slice(0, 10);
        bookingJson.createdAt = bookingJson.createdAt.toISOString().slice(0,19).replace('T', ' ');
        bookingJson.updatedAt = bookingJson.updatedAt.toISOString().slice(0,19).replace('T', ' ');


        // return updated version of the booking
        return bookingJson;
    })

    return res.json({Bookings: addToBooking})
})

///////////////////////////////////////////////
// edit a booking
router.put('/:bookingId', requireAuth, validateBooking, async(req, res) => {
    const {startDate, endDate} = req.body;

    // find the booking
    const booking = await Booking.findByPk(req.params.bookingId);

    // check exists
    if (!booking) {
        res.status(404);
        return res.json({"message": "Booking couldn't be found"})
    }

    // check if the booking is in the past
    // if to edit the date past the current date, error
    const currDate = new Date();
    const bookingEndDate = new Date(booking.endDate); // Convert booking.endDate to a Date object for comparison
    if (bookingEndDate < currDate) {
        res.status(403);
        return res.json({"message": "Past bookings can't be modified"});
    }

    // check conflict booking
    // find one booking
    const conflictBooking = await Booking.findOne({
        where: {
            spotId: booking.spotId,
            [Op.or]: [
                {
                    startDate: {[Op.lte]: endDate},
                    endDate: {[Op.gte]: startDate}
                }
            ]
        }
    })
    // error handling the conflict booking
    if (conflictBooking && conflictBooking.id !== booking.id) {
        res.status(403);
        return res.json({
            "message": "Sorry, this spot is already booked for the specified dates",
            "errors": {
                "startDate": "Start date conflicts with an existing booking",
                "endDate": "End date conflicts with an existing booking"
            }
      })
    }

    booking.startDate = startDate;
    booking.endDate = endDate;

    const response = {
        id: booking.id,
        spotId: booking.spotId,
        userId: booking.userId,
        startDate: booking.startDate.toISOString().slice(0, 10),
        endDate: booking.endDate.toISOString().slice(0, 10),
        createdAt: booking.createdAt.toISOString().slice(0,19).replace('T', ' '),
        updatedAt: booking.updatedAt.toISOString().slice(0,19).replace('T', ' ')
    }

    await booking.save();
    return res.json(response)
})

///////////////////////////////////////
// delete a booking
router.delete('/:bookingId', requireAuth, async(req, res) => {
    // find the booking
    const booking = await Booking.findByPk(req.params.bookingId);

    // check exist
    if (!booking) {
        res.status(404);
        return res.json({"message": "Booking couldn't be found"})
    }

    // check booking already started
    const currDate = new Date();
    const startBooking = new Date(booking.startDate); // convert to Date obj for comparison

    if(currDate >= startBooking) {
        res.status(403);
        return res.json({"message": "Bookings that have been started can't be deleted"});
    } else {
        await booking.destroy();
    }

    return res.json({"message": "Successfully deleted"})
})

module.exports = router;
