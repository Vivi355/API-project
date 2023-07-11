'use strict';

const {ReviewImage} = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await ReviewImage.bulkCreate([
      {
        reviewId:1,
        url: 'review1.jpg'
      },
      {
        reviewId:2,
        url: 'review2.jpg'
      },{
        reviewId:2,
        url: 'review3.jpg'
      },
    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: { [Op.in ]: ['review1.jpg', 'review2.jpg', 'review3.jpg'] }
    }, {})
  }
};
