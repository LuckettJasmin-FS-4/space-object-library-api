'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class StarsPlanets extends Model {}

  StarsPlanets.init(
    {
      starId: DataTypes.INTEGER,
      planetId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'StarsPlanets',
    }
  );

  return StarsPlanets;
};