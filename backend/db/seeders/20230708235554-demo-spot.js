'use strict';

const { Spot } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: '123 First Street',
        city: "San Francisco",
        state: "California",
        country: 'United States of America',
        lat: 37.5345345,
        lng: -129.5439689,
        name: 'address1',
        description: 'description for address 1',
        price: 123.99
      },
      {
        ownerId: 2,
        address: '456 Second Avenue',
        city: "San Jose",
        state: "California",
        country: 'United States of America',
        lat: 41.5345345,
        lng: -153.5439689,
        name: 'address2',
        description: 'description for address 2',
        price: 162.99
      },
      {
        ownerId: 3,
        address: '789 Third Street',
        city: "San Diego",
        state: "California",
        country: 'United States of America',
        lat: 78.5345345,
        lng: -165.5439689,
        name: 'address3',
        description: 'description for address 3',
        price: 188.99
      }
    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in ]: ['address1', 'address2', 'address3'] }
    }, {})
  }
};
