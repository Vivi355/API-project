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
        review: 'Awesome Spot!',
        stars: 5
      },
      {
        spotId: 2,
        userId: 2,
        review: 'Greate Spot!',
        stars: 4
      },
      {
        spotId: 3,
        userId: 3,
        review: 'Good Spot!',
        stars: 3
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      review: { [Op.in ]: ['Awesome Spot!', 'Greate Spot!', 'Good Spot!']}
    }, {})
  }
};
