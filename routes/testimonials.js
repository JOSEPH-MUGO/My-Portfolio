// routes/testimonials.js
const express    = require('express');
const router     = express.Router();
const multer     = require('multer');
const upload     = multer({ storage: multer.memoryStorage() });
const { models } = require('../models');
const Testimonials    = models.testimonials;
const cloudinary = require('../utils/cloudinary');

function uploadToCloudinary(buffer) {
  return new Promise((res, rej) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'portfolio/testimonials' },
      (err, result) => err ? rej(err) : res(result)
    );
    stream.end(buffer);
  });
}

// Public: approved only
router.get('/', async (req, res) => {
  const approved = await Testimonials.findAll({ where: { approved: true } });
  res.json(approved);
});

// Public: submit new
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    const { name, role, quote } = req.body;
    let photoUrl = null;
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      photoUrl = result.secure_url;
    }
    await Testimonials.create({ name, role, quote, photo: photoUrl, approved: false });
    res.status(201).json({ message: 'Thanks! Pending approval.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Submission failed.' });
  }
});

// Admin: pending list
router.get('/pending', async (req, res) => {
  const pending = await Testimonials.findAll({ where: { approved: false } });
  res.json(pending);
});

// Admin: approve one
router.put('/:id/approve', async (req, res) => {
  const t = await Testimonials.findByPk(req.params.id);
  if (!t) return res.status(404).json({ error: 'Not found.' });
  t.approved = true;
  await t.save();
  res.json(t);
});

// Admin: delete
router.delete('/:id', async (req, res) => {
  await Testimonials.destroy({ where: { id: req.params.id } });
  res.sendStatus(204);
});

module.exports = router;
