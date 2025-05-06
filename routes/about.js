// routes/about.js
const express    = require('express');
const router     = express.Router();
const multer     = require('multer');
const upload     = multer({ storage: multer.memoryStorage() });
const About      = require('../models/About')(require('../models/index'));
const cloudinary = require('../utils/cloudinary');

function uploadToCloudinary(buffer) {
  return new Promise((res, rej) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'portfolio/about' },
      (err, result) => err ? rej(err) : res(result)
    );
    stream.end(buffer);
  });
}

// GET /api/about
router.get('/', async (req, res, next) => {
  try {
    const record = await About.findOne();
    res.json(record || {});
  } catch (err) {
    next(err);
  }
});

// POST /api/about
router.post('/', upload.single('photo'), async (req, res, next) => {
  try {
    let photoUrl = undefined;
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      photoUrl = result.secure_url;
    }

    const { bio } = req.body;
    let record = await About.findOne();

    if (record) {
      record.bio = bio;
      if (photoUrl) record.photo = photoUrl;
      await record.save();
    } else {
      record = await About.create({ bio, photo: photoUrl });
    }

    res.json(record);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
