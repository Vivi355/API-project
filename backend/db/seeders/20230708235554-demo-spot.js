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
        name: 'Urban Loft in Downtown',
        description: 'The studio combines historical charm with modern comfort and is within walking distance to renowned landmarks, museums, and local eateries.',
        price: 123.99
      },
      {
        ownerId: 2,
        address: '1001 North Ave',
        city: "San Jose",
        state: "California",
        country: 'United States of America',
        lat: 41.5345345,
        lng: -153.5439689,
        name: 'Serene Lakefront Cottage',
        description: "Experience tranquility at our serene lakefront cottage, nestled in the heart of nature's bounty. The cottage offers a picturesque view of the lake, framed by lush greenery. It is an ideal getaway for those seeking peace and quiet, away from the city's hustle and bustle.",
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
        name: 'Cozy Mountain Cabin',
        description: 'Escape to our cozy mountain cabin nestled amidst towering pines and breathtaking mountain views. The cabin provides the perfect retreat for nature lovers and adventurers alike, with nearby hiking trails and a plethora of wildlife.',
        price: 188.99
      }
    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      address: { [Op.in ]: ['123 First Street', '1001 North Ave', '789 Third Street'] }
    }, {})
  }
};
