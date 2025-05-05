const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('Service', {
    icon:        { type: DataTypes.STRING, allowNull: false }, // e.g. "code", "database"
    title:       { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
  });
};
