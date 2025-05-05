const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Testimonial', {
    name:      { type: DataTypes.STRING, allowNull: false },
    role:      { type: DataTypes.STRING, allowNull: false },
    quote:     { type: DataTypes.TEXT,   allowNull: false },
    photo:     { type: DataTypes.STRING },              // filename
    approved:  { type: DataTypes.BOOLEAN, defaultValue: false },
  }, {
    timestamps: true
  });
};