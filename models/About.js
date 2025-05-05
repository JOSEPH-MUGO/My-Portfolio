const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
  return sequelize.define('About', {
    bio:    { type: DataTypes.TEXT, allowNull: false },
    photo:  { type: DataTypes.STRING },        // filename of the profile image
  }, { timestamps: false });
};
