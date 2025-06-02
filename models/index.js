const { Sequelize } = require('sequelize');
require('dotenv').config();


// Initialize Sequelize with your PostgreSQL database credentials
const sequelize = new Sequelize(
  process.env.DB_NAME,     // database name
  process.env.DB_USER,     // database user
  process.env.DB_PASSWORD, // database password
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false, 
  }
);

// Test the connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();
const Project = require('./Project')(sequelize);
const About         = require('./About')(sequelize);
const Skill         = require('./Skill')(sequelize);
const Education     = require('./Education')(sequelize);
const Certification = require('./Certification')(sequelize);
const Experience    = require('./Experience')(sequelize);
const Service       = require('./Service')(sequelize);
const Testimonial   = require('./Testimonials')(sequelize);

// Define associations if needed
sequelize.sync({ alter: true })
  .then(() => {
    console.log(' All Tables synced successfully.');
  })
  .catch(err => {
    console.error(' Error syncing tables:', err);
  });




module.exports = {
  sequelize,
  models: {
    about:         About,
    projects:      Project,
    skills:        Skill,
    education:     Education,
    certifications: Certification,
    experience:    Experience,
    services:      Service,
    testimonials:  Testimonial,
  }
};
