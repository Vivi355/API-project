'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SpotImage extends Model {
    static associate(models) {
      SpotImage.belongsTo(models.Spot, {
        foreignKey: 'spotId',
      })
    }
  }
  SpotImage.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    spotId: {
      type: DataTypes.INTEGER,
      allowNull:false,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull:false,
      unique: true
    },
    preview: {
      type: DataTypes.BOOLEAN,
      allowNull:false,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'SpotImage',
    defaultScope: {
      attributes: {
        exclude: ['spotId', 'createdAt', 'updatedAt']
      }
    }
  });
  return SpotImage;
};
