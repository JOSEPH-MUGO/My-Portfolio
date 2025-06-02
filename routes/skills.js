// routes/skills.js
const express = require('express');
const router  = express.Router();
const { models } = require('../models');
const Skill    = models.skills;

// GET /api/skills — list all
router.get('/', async (req, res) => {
  try {
    const skills = await Skill.findAll();
    res.json(skills);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
});

// POST /api/skills — create new
router.post('/', async (req, res) => {
  try {
    const { name, level } = req.body;
    const skill = await Skill.create({ name, level });
    res.status(201).json(skill);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create skill' });
  }
});

// PUT /api/skills/:id — update
router.put('/:id', async (req, res) => {
  try {
    const skill = await Skill.findByPk(req.params.id);
    if (!skill) return res.status(404).json({ error: 'Not found' });
    await skill.update(req.body);
    res.json(skill);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update skill' });
  }
});

// DELETE /api/skills/:id — delete
router.delete('/:id', async (req, res) => {
  try {
    const count = await Skill.destroy({ where: { id: req.params.id } });
    if (!count) return res.status(404).json({ error: 'Not found' });
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete skill' });
  }
});

module.exports = router;
