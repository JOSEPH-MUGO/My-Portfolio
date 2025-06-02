// routes/skills.js
const express = require('express');
const router  = express.Router();
const { models } = require('../models');
const Experience    = models.experience;

// List
router.get('/', async (req, res) => res.json(await Experience.findAll()));

// Create
router.post('/', async (req, res) => {
  const { company, role, period, description } = req.body;
  const expe = await Experience.create({ company, role, period, description });
  res.status(201).json(expe);
});

// Update
router.put('/:id', async (req, res) => {
  const expe = await Experience.findByPk(req.params.id);
  if (!expe) return res.sendStatus(404);
  await expe.update(req.body);
  res.json(expe);
});

// Delete
router.delete('/:id', async (req, res) => {
  await Experience.destroy({ where: { id: req.params.id } });
  res.sendStatus(204);
});

module.exports = router;
