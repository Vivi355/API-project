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
        url: 'https://cdn.discordapp.com/attachments/1134917911941742615/1134919855657721897/frames-for-your-heart-2d4lAQAlbDA-unsplash.jpg',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://cdn.discordapp.com/attachments/1134917911941742615/1134920110021288027/greg-rivers-rChFUMwAe7E-unsplash.jpg',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://cdn.discordapp.com/attachments/1134917911941742615/1134920697534230559/johnson-johnson-U6Q6zVDgmSs-unsplash.jpg',
        preview: true
      },
      {
        spotId: 1,
        url: 'https://cdn.discordapp.com/attachments/1134917911941742615/1134918003654398095/fomstock-4ojhpgKpS68-unsplash.jpg',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://cdn.discordapp.com/attachments/1134917911941742615/1136780583935148133/kara-eads-L7EwHkq1B2s-unsplash.jpg',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://cdn.discordapp.com/attachments/1134917911941742615/1136780920578387968/florian-schmidinger-b_79nOqf95I-unsplash.jpg',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://cdn.discordapp.com/attachments/1134917911941742615/1136781300976603176/john-fornander-y3_AHHrxUBY-unsplash.jpg',
        preview: false
      },

      {
        spotId: 2,
        url: 'https://cdn.discordapp.com/attachments/1134917911941742615/1136781526873423912/jarek-ceborski-jn7uVeCdf6U-unsplash.jpg',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://cdn.discordapp.com/attachments/1134917911941742615/1136781743261745263/brian-babb-XbwHrt87mQ0-unsplash.jpg',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://cdn.discordapp.com/attachments/1134917911941742615/1136781928104722464/jason-briscoe-UV81E0oXXWQ-unsplash.jpg',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://cdn.discordapp.com/attachments/1134917911941742615/1136782060862840892/patrick-perkins-3wylDrjxH-E-unsplash.jpg',
        preview: false
      },

      {
        spotId: 3,
        url: 'https://cdn.discordapp.com/attachments/1134917911941742615/1136782329042452560/francesca-tosolini-DmOhItSo49k-unsplash.jpg',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://cdn.discordapp.com/attachments/1134917911941742615/1136782640603730043/francesca-tosolini-qnSTxcs0EEs-unsplash.jpg',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://cdn.discordapp.com/attachments/1134917911941742615/1136782884288594021/i-do-nothing-but-love-lAyXdl1-Wmc-unsplash.jpg',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://cdn.discordapp.com/attachments/1134917911941742615/1136783244986167447/olga-subach-SiRLWc8UE5Q-unsplash.jpg',
        preview: false
      }

    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in ]: [1, 2, 3] }
    }, {})
  }
};
