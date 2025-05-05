// routes/about.js
const express = require('express');
const router  = express.Router();
const upload  = require('../middlewares/upload');
const About   = require('../models/About')(require('../models/index'));

// Get about
router.get('/', async (req, res) => {
  const record = (await About.findAll({ limit: 1 }))[0];
  res.json(record);
});

// Create or Update (upsert)
router.post('/', upload.single('photo'), async (req, res) => {
  const { bio } = req.body;
  const photo   = req.file?.filename;
  let record    = (await About.findAll({ limit: 1 }))[0];

  if (record) {
    record.bio = bio;
    if (photo) record.photo = photo;
    await record.save();
  } else {
    record = await About.create({ bio, photo });
  }
  res.json(record);
});

module.exports = router;
