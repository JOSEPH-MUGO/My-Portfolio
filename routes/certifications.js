// routes/certifications.js
const express    = require('express');
const router     = express.Router();
const multer     = require('multer');
const upload     = multer({ storage: multer.memoryStorage() });
const sequelize  = require('../models');
const Certification = require('../models/Certification')(sequelize);
const cloudinary = require('../utils/cloudinary');

function uploadToCloudinary(buffer) {
  return new Promise((res, rej) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'portfolio/certifications' },
      (err, result) => err ? rej(err) : res(result)
    );
    stream.end(buffer);
  });
}

// GET all
router.get('/', async (req, res) => {
  const certs = await Certification.findAll();
  res.json(certs);
});

// GET one
router.get('/:id', async (req, res) => {
  const cert = await Certification.findByPk(req.params.id);
  if (!cert) return res.status(404).json({ error: 'Not found.' });
  res.json(cert);
});

// CREATE
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    const { title, issuer, dateAward, link } = req.body;
    if (!title || !issuer || !dateAward) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    let photoUrl = null;
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      photoUrl = result.secure_url;
    }

    const newCert = await Certification.create({
      title, issuer, dateAward, link, photo: photoUrl
    });
    res.status(201).json(newCert);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Creation failed.' });
  }
});

// UPDATE
router.put('/:id', upload.single('photo'), async (req, res) => {
  try {
    const cert = await Certification.findByPk(req.params.id);
    if (!cert) return res.status(404).json({ error: 'Not found.' });

    const { title, issuer, dateAward, link } = req.body;
    if (title)     cert.title     = title;
    if (issuer)    cert.issuer    = issuer;
    if (dateAward) cert.dateAward = dateAward;
    if (link)      cert.link      = link;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      cert.photo = result.secure_url;
    }

    await cert.save();
    res.json(cert);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed.' });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Certification.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Not found.' });
    res.json({ message: 'Deleted.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Deletion failed.' });
  }
});

module.exports = router;
