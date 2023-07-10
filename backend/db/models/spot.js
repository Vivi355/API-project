'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    static associate(models) {
      Spot.belongsTo(models.User, {
        foreignKey: 'ownerId'
      }),
      Spot.hasMany(models.SpotImage, {
        foreignKey: 'spotId',
        onDelete: 'CASCADE'
      }),
      Spot.hasMany(models.Review, {
        foreignKey: 'spotId',
        onDelete: 'CASCADE'
      })
    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull:false
    },
    address: {
      type: DataTypes.STRING,
      allowNull:false,
      unique: true,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Street address is required'
        }
      }
    },
    city: {
      type: DataTypes.STRING,
      allowNull:false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'City is required'
        },
        titleCased(value) {
          const words = value.split(' ');
          for (let word of words) {
            if (word[0] !== word[0].toUpperCase()) {
              throw new Error('Must be title cased');
            }
          }
        }
      }
    },
    state: {
      type: DataTypes.STRING,
      allowNull:false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'State is required'
        }
      }
    },
    country: {
      type: DataTypes.STRING,
      allowNull:false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Country is required'
        }
      }
    },
    lat: {
      type: DataTypes.DECIMAL,
      allowNull:false,
      validate: {
        isDecimal: {
          args: true,
          msg: 'Latitude is not valid'
        },
        min: -90,
        max: 90
      }
    },
    lng: {
      type: DataTypes.DECIMAL,
      allowNull:false,
      validate: {
        isDecimal: {
          args: true,
          msg: 'Longitude is not valid'
        },
        min: -180,
        max: 180
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull:false,
      validate: {
        len: [1, 50],
        isGreaterThan(value) {
          if (value.length > 50) {
            throw new Error('Name must be less than 50 characters')
          }
        }
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull:false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Description is required'
        }
      }
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull:false,
      validate: {
        isDecimal: true,
        min: 0,
        notEmpty: {
          args: true,
          msg: 'Price per day is required'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
