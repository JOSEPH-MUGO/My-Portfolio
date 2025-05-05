// routes/certifications.js

const express = require('express');
const router = express.Router();
const path = require('path');
const upload = require('../middlewares/upload'); // your multer setup
const sequelize  = require('../models');      // import initialized Sequelize
const Certification = require('../models/Certification')(sequelize);

// ── GET all certifications ─────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const certs = await Certification.findAll();
    res.json(certs);
  } catch (err) {
    console.error('Error fetching certifications:', err);
    res.status(500).json({ error: 'Failed to fetch certifications.' });
  }
});

// ── GET one certification ──────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const cert = await Certification.findByPk(req.params.id);
    if (!cert) return res.status(404).json({ error: 'Certification not found.' });
    res.json(cert);
  } catch (err) {
    console.error('Error fetching certification:', err);
    res.status(500).json({ error: 'Failed to fetch certification.' });
  }
});

// ── CREATE a new certification ─────────────────────────────────────────
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    const { title, issuer, dateAward, link } = req.body;
    const photo = req.file ? req.file.filename : null;

    // Validate required fields
    if (!title || !issuer || !dateAward) {
      return res.status(400).json({ error: 'Title, issuer, and dateAward are required.' });
    }

    const newCert = await Certification.create({
      title,
      issuer,
      dateAward,
      link,
      photo
    });

    res.status(201).json(newCert);
  } catch (err) {
    console.error('Error creating certification:', err);
    res.status(500).json({ error: 'Failed to create certification.' });
  }
});

// ── UPDATE a certification ─────────────────────────────────────────────
router.put('/:id', upload.single('photo'), async (req, res) => {
  try {
    const cert = await Certification.findByPk(req.params.id);
    if (!cert) return res.status(404).json({ error: 'Certification not found.' });

    const { title, issuer, dateAward, link } = req.body;
    if (title)     cert.title     = title;
    if (issuer)    cert.issuer    = issuer;
    if (dateAward) cert.dateAward = dateAward;
    if (link)      cert.link      = link;
    if (req.file)  cert.photo     = req.file.filename;

    await cert.save();
    res.json(cert);
  } catch (err) {
    console.error('Error updating certification:', err);
    res.status(500).json({ error: 'Failed to update certification.' });
  }
});

// ── DELETE a certification ──────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Certification.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Certification not found.' });
    res.json({ message: 'Certification deleted successfully.' });
  } catch (err) {
    console.error('Error deleting certification:', err);
    res.status(500).json({ error: 'Failed to delete certification.' });
  }
});

module.exports = router;
