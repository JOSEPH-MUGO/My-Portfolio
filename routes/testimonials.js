const express = require('express');
const router  = express.Router();
const upload  = require('../middlewares/upload');
const Testimonials = require('../models/Testimonials')(require('../models/index'));

// Public: get only approved
router.get('/', async (req, res) => {
  const approved = await Testimonials.findAll({ where: { approved: true } });
  res.json(approved);
});

// Public: submit new (unapproved)
router.post('/', upload.single('photo'), async (req, res) => {
  const { name, role, quote } = req.body;
  const photo = req.file ? req.file.filename : null;
  try {
    const t = await Testimonials.create({ name, role, quote, photo, approved: false });
    res.status(201).json({ message: 'Thank you! Your testimony will be reviewed for approval.' });
  } catch (err) {
    res.status(500).json({ error: 'Submission failed.' });
  }
});

// Admin: list pending
router.get('/pending', async (req, res) => {
  const pending = await Testimonials.findAll({ where: { approved: false } });
  res.json(pending);
});

// Admin: approve one
router.put('/:id/approve', async (req, res) => {
  const t = await Testimonials.findByPk(req.params.id);
  if (!t) return res.status(404).json({ error: 'Not found' });
  t.approved = true;
  await t.save();
  res.json(t);
});

// Admin: full CRUD if desired
router.delete('/:id', async (req, res) => {
  await Testimonials.destroy({ where: { id: req.params.id } });
  res.sendStatus(204);
});

module.exports = router;
