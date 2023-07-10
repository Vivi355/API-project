'use strict';

const {Booking} = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Booking.bulkCreate([
      {
        spotId: 1,
        userId: 1,
        startDate: '2023-08-01',
        endDate: '2023-08-02'
      },
      {
        spotId: 2,
        userId: 2,
        startDate: '2023-09-01',
        endDate: '2023-09-02'
      },
      {
        spotId: 3,
        userId: 3,
        startDate: '2023-10-01',
        endDate: '2023-10-02'
      }
    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      startDate: { [Op.in ]: ['2023-08-01', '2023-09-01', '2023-10-01'] }
    }, {})
  }
};
