const {DataTypes} = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('Education', {
    degree: { type: DataTypes.STRING, allowNull: false },
    institution: { type: DataTypes.STRING, allowNull: false }, // e.g. "John is a great developer!"
    period: { type: DataTypes.STRING, allowNull: false }, // e.g. "https://example.com/image.jpg"
  });
};