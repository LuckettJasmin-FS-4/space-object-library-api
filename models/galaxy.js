'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Galaxy extends Model {
    static associate(models) {
      Galaxy.hasMany(models.Star, {
        foreignKey: 'galaxyId',
        as: 'stars',
      });
    }
  }

  Galaxy.init(
    {
      name: DataTypes.STRING,
      size: DataTypes.INTEGER,
      description: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'Galaxy',
    }
  );

  return Galaxy;
};