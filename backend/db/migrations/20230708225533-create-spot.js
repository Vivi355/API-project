'use strict';
/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define options obj
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Spots', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ownerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: 'Users', key: 'id'},
        onDelete: 'CASCADE'
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true
      },
      city: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      state: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      country: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      lat: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      lng: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      price: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    }, options);
  },
  async down(queryInterface, Sequelize) {
    options.tableName = 'Spots';
    return queryInterface.dropTable(options);
  }
};
