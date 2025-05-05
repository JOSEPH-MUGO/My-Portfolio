const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('Certification', {

    title:     { type: DataTypes.STRING, allowNull: false },
    issuer:    { type: DataTypes.STRING, allowNull: false },
    dateAward: { type: DataTypes.DATEONLY, allowNull: false },
    link:      { type: DataTypes.STRING },
    photo:  { type: DataTypes.STRING }  // optional credential URL
  });
};
