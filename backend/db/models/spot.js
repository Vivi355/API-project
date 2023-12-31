'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    static associate(models) {
      Spot.belongsTo(models.User, {
        foreignKey: 'ownerId', as: 'Owner'
      }),
      Spot.hasMany(models.SpotImage, {
        foreignKey: 'spotId',
        onDelete: 'CASCADE'
      }),
      Spot.hasMany(models.Review, {
        foreignKey: 'spotId',
        onDelete: 'CASCADE'
      }),
      Spot.hasMany(models.Booking, {
        foreignKey: 'spotId',
        onDelete: 'CASCADE'
      })
    }
  }
  Spot.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull:false
    },
    address: {
      type: DataTypes.TEXT,
      allowNull:false,
      unique: true
    },
    city: {
      type: DataTypes.TEXT,
      allowNull:false
    },
    state: {
      type: DataTypes.STRING,
      allowNull:false
    },
    country: {
      type: DataTypes.TEXT,
      allowNull:false
    },
    lat: {
      type: DataTypes.DECIMAL,
      allowNull:false,
      unique: true
    },
    lng: {
      type: DataTypes.DECIMAL,
      allowNull:false,
      unique: true
    },
    name: {
      type: DataTypes.TEXT,
      allowNull:false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull:false
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull:false,
      validate: {
        isDecimal: true,
        min: 0
      }
    }
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
