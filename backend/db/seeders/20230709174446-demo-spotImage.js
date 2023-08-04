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
      },

      // new seed data
      {
        spotId: 4,
        url: 'https://cdn.discordapp.com/attachments/1134917911941742615/1135344383500243146/ronnie-george-9gGvNWBeOq4-unsplash.jpg',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://cdn.discordapp.com/attachments/1134917911941742615/1136781526873423912/jarek-ceborski-jn7uVeCdf6U-unsplash.jpg',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://cdn.discordapp.com/attachments/1134917911941742615/1136780583935148133/kara-eads-L7EwHkq1B2s-unsplash.jpg',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://cdn.discordapp.com/attachments/1134917911941742615/1136781928104722464/jason-briscoe-UV81E0oXXWQ-unsplash.jpg',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://cdn.discordapp.com/attachments/1134917911941742615/1137074942890999848/jason-briscoe-AQl-J19ocWE-unsplash.jpg',
        preview: false
      },

      {
        spotId: 5,
        url: 'https://cdn.discordapp.com/attachments/1134917911941742615/1134920491853951006/scott-webb-1ddol8rgUH8-unsplash.jpg',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://cdn.discordapp.com/attachments/1134917911941742615/1137075878023659601/francesca-tosolini-tHkJAMcO3QE-unsplash.jpg',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://cdn.discordapp.com/attachments/1134917911941742615/1137076000673501254/aaron-huber-G7sE2S4Lab4-unsplash.jpg',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://cdn.discordapp.com/attachments/1134917911941742615/1136782640603730043/francesca-tosolini-qnSTxcs0EEs-unsplash.jpg',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://cdn.discordapp.com/attachments/1134917911941742615/1136781526873423912/jarek-ceborski-jn7uVeCdf6U-unsplash.jpg',
        preview: false
      },

      {
        spotId: 6,
        url: 'https://cdn.discordapp.com/attachments/1134917911941742615/1137076486923358219/hutomo-abrianto-9mPl0Zo7_gQ-unsplash.jpg',
        preview: true
      },
      {
        spotId: 6,
        url: 'https://cdn.discordapp.com/attachments/1134917911941742615/1137076486923358219/hutomo-abrianto-9mPl0Zo7_gQ-unsplash.jpg',
        preview: false
      },
      {
        spotId: 6,
        url: 'https://cdn.discordapp.com/attachments/1134917911941742615/1137076743560233010/alan-j-hendry-zVf-R-r3szw-unsplash.jpg',
        preview: false
      },
      {
        spotId: 6,
        url: 'https://cdn.discordapp.com/attachments/1134917911941742615/1137076000673501254/aaron-huber-G7sE2S4Lab4-unsplash.jpg',
        preview: false
      },
      {
        spotId: 6,
        url: 'https://cdn.discordapp.com/attachments/1134917911941742615/1136782060862840892/patrick-perkins-3wylDrjxH-E-unsplash.jpg',
        preview: false
      },

      {
        spotId: 7,
        url: 'https://cdn.discordapp.com/attachments/1134917911941742615/1137077473159422072/max-anderson-9-a7z7hTWzw-unsplash.jpg',
        preview: true
      },
      {
        spotId: 7,
        url: 'https://cdn.discordapp.com/attachments/1134917911941742615/1137077005293199370/marvin-meyer-cjhuXRtRT0Y-unsplash.jpg',
        preview: false
      },
      {
        spotId: 7,
        url: 'https://cdn.discordapp.com/attachments/1134917911941742615/1137077112466067466/avery-klein-JaXs8Tk5Iww-unsplash.jpg',
        preview: false
      },
      {
        spotId: 7,
        url: 'https://cdn.discordapp.com/attachments/1134917911941742615/1137077230133067857/alexandra-gorn-JIUjvqe2ZHg-unsplash.jpg',
        preview: false
      },
      {
        spotId: 7,
        url: 'https://cdn.discordapp.com/attachments/1134917911941742615/1137075878023659601/francesca-tosolini-tHkJAMcO3QE-unsplash.jpg',
        preview: false
      },


    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in ]: [1, 2, 3, 4, 5, 6, 7] }
    }, {})
  }
};
