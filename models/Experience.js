const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('Experience', {
    company: { type: DataTypes.STRING, allowNull: false },
    role:    { type: DataTypes.STRING, allowNull: false },
    period:  { type: DataTypes.STRING, allowNull: false },
    description: {type: DataTypes.STRING, allowNull: false }, // e.g. "Developed a web application using React and Node.js" 
  });
};
