'use strict';

const { Review } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Review.bulkCreate([
      {
        spotId: 1,
        userId: 1,
        review: 'This urban loft in downtown San Francisco exceeded all of our expectations. The location is fantastic, with a multitude of shops and restaurants just steps away. The loft itself was beautifully designed and decorated. Highly recommend!',
        stars: 5
      },
      {
        spotId: 1,
        userId: 2,
        review: "We loved our stay in this urban loft. It was spacious, clean, and modern. The location couldn't have been better.",
        stars: 4
      },
      {
        spotId: 2,
        userId: 2,
        review: 'This serene lakefront cottage was the perfect getaway from the city. The view of the lake was breathtaking, and the cottage itself was cozy and comfortable. ',
        stars: 4
      },
      {
        spotId: 3,
        userId: 3,
        review: "It was spacious, clean, and modern. The location couldn't have been better.!",
        stars: 4
      },

      {
        spotId: 4,
        userId: 1,
        review: 'We enjoyed our time here!',
        stars: 4
      },
      {
        spotId: 5,
        userId: 2,
        review: 'It was a really nice place to stay, and with family!',
        stars: 5
      },
      {
        spotId: 6,
        userId: 1,
        review: 'We had a fantastic time!',
        stars: 5
      },
      {
        spotId: 7,
        userId: 2,
        review: 'Very nice! Cozy and comfortable!',
        stars: 5
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in ]: [1, 2, 3, 4, 5, 6, 7]}
    }, {})
  }
};
