// routes/projects.js
const express    = require('express');
const router     = express.Router();
const multer     = require('multer');
const { models } = require('../models');
const Project    = models.projects;
const cloudinary = require('../utils/cloudinary');

// Multer: store uploads in memory
const upload = multer({ storage: multer.memoryStorage() });

// Helper to upload buffer to Cloudinary
function uploadToCloudinary(buffer, folder = 'portfolio/projects') {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
}

// GET /api/projects
router.get('/', async (req, res) => {
  const projects = await Project.findAll();
  res.json(projects);
});

// POST /api/projects
router.post('/', upload.single('image'), async (req, res) => {
  try {
    let imageUrl = null;
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
    }

    const newProject = await Project.create({
      title:       req.body.title,
      description: req.body.description,
      link:        req.body.link,
      image:       imageUrl
    });

    res.status(201).json(newProject);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/projects/:id
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    project.title       = req.body.title;
    project.description = req.body.description;
    project.link        = req.body.link;

    if (req.file) {
      // upload new image, overwrite project.image
      const result = await uploadToCloudinary(req.file.buffer);
      project.image = result.secure_url;
    }

    await project.save();
    res.json(project);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update project.' });
  }
});

// DELETE /api/projects/:id
router.delete('/:id', async (req, res) => {
  try {
    const count = await Project.destroy({ where: { id: req.params.id } });
    if (count) {
      res.json({ message: 'Project deleted successfully' });
    } else {
      res.status(404).json({ error: 'Project not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete project.' });
  }
});

module.exports = router;
