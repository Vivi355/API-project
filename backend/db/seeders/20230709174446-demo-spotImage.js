'use strict';

const { SpotImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await SpotImage.bulkCreate([
      {
        spotId: 1,
        url: 'spotimage1.jpg',
        preview: true
      },
      {
        spotId: 2,
        url: 'spotimage2.jpg',
        preview: true
      },
      {
        spotId: 3,
        url: 'spotimage3.jpg',
        preview: true
      },
      {
        spotId: 1,
        url: 'spotimage4.jpg',
        preview: false
      }
    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: { [Op.in ]: ['spotimage1.jpg', 'spotimage2.jpg', 'spotimage3.jpg'] }
    }, {})
  }
};
