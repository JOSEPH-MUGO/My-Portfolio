const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('Skill', {
    name:  { type: DataTypes.STRING, allowNull: false },
    level: { type: DataTypes.INTEGER, allowNull: false },  // 0–100%
  });
};
