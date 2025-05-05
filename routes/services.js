// routes/skills.js
const express = require('express');
const router  = express.Router();
const Service   = require('../models/Service')(require('../models/index'));

// List
router.get('/', async (req, res) => res.json(await Service.findAll()));

// Create
router.post('/', async (req, res) => {
  const { icon, title, description } = req.body;
  const service = await Service.create({ icon, title, description });
  res.status(201).json(service);
});

// Update
router.put('/:id', async (req, res) => {
  const service = await Service.findByPk(req.params.id);
  if (!service) return res.sendStatus(404);
  await service.update(req.body);
  res.json(service);
});

// Delete
router.delete('/:id', async (req, res) => {
  await Service.destroy({ where: { id: req.params.id } });
  res.sendStatus(204);
});

module.exports = router;
