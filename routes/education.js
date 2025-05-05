const express = require('express');
const router  = express.Router();
const Education   = require('../models/Education')(require('../models/index'));

// List
router.get('/', async (req, res) => res.json(await Education.findAll()));

// Create
router.post('/', async (req, res) => {
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
  const { degree, institution, period} = req.body;
  const ed = await Education.create({ degree, institution, period});
  res.status(201).json(ed);
});

// Update
router.put('/:id', async (req, res) => {
  const ed = await Education.findByPk(req.params.id);
  if (!ed) return res.sendStatus(404);
  await ed.update(req.body);
  res.json(ed);
});

// Delete
router.delete('/:id', async (req, res) => {
  await Education.destroy({ where: { id: req.params.id } });
  res.sendStatus(204);
});

module.exports = router;
