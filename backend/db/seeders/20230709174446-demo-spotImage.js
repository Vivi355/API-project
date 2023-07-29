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
        url: 'https://cdn.discordapp.com/attachments/1134917911941742615/1134918003654398095/fomstock-4ojhpgKpS68-unsplash.jpg',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://cdn.discordapp.com/attachments/1134917911941742615/1134919855657721897/frames-for-your-heart-2d4lAQAlbDA-unsplash.jpg',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://cdn.discordapp.com/attachments/1134917911941742615/1134920110021288027/greg-rivers-rChFUMwAe7E-unsplash.jpg',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://cdn.discordapp.com/attachments/1134917911941742615/1134920491853951006/scott-webb-1ddol8rgUH8-unsplash.jpg',
        preview: true
      },

      {
        spotId: 1,
        url: 'https://cdn.discordapp.com/attachments/1134917911941742615/1134920697534230559/johnson-johnson-U6Q6zVDgmSs-unsplash.jpg',
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
