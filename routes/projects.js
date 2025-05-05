// Description: This file contains the routes for managing projects in the application.
const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload'); 
const Project = require('../models/Project')(require('../models/index'));


router.get('/', async (req, res) => {
  const projects = await Project.findAll();
  res.json(projects);
});

router.post('/', upload.single('image'), async (req, res) => {
    try {
      const { title, description, link } = req.body;
      const image = req.file ? req.file.filename : null;
      
  
      const newProject = await Project.create({ title, description, link, image });
      res.status(201).json(newProject);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.put('/:id', upload.single('image'), async (req, res) => {
    const { title, description, link } = req.body;
    const image = req.file ? req.file.filename : null;
  
    try {
      const project = await Project.findByPk(req.params.id);
      if (!project) return res.status(404).json({ error: 'Project not found' });
  
      project.title = title;
      project.description = description;
      project.link = link;
      if (image) {
        project.image = image;  // Only update image if a new one is uploaded
      }
  
      await project.save();
      res.json(project);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update project.' });
    }
  });
  

router.delete('/:id', async (req, res) => {
  try {
    const result = await Project.destroy({ where: { id: req.params.id } });
    if (result) {
      res.json({ message: 'Project deleted successfully' });
    } else {
      res.status(404).json({ error: 'Project not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete project.' });
  }
});

module.exports = router;
