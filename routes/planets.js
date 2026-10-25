const express = require('express');
const { Planet, Star } = require('../models');
const upload = require('../middleware/upload');

const router = express.Router();

// Display all planets
router.get('/', async (req, res) => {
  try {
    const planets = await Planet.findAll({
      include: [{ model: Star, as: 'stars' }],
      order: [['id', 'ASC']]
    });

    res.render('planets/index', { planets });
  } catch (error) {
    console.error(error);
    res.status(500).send('Unable to load planets');
  }
});

// Display Add Planet form
router.get('/new', async (req, res) => {
  try {
    const stars = await Star.findAll({
      order: [['name', 'ASC']]
    });

    res.render('planets/new', { stars });
  } catch (error) {
    console.error(error);
    res.status(500).send('Unable to load form');
  }
});

// Create a planet
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, size, description, starId } = req.body;

    if (!name?.trim()) {
      return res.status(400).send('Planet name is required');
    }

    let star = null;

    if (starId) {
      star = await Star.findByPk(starId);

      if (!star) {
        return res.status(400).send('Invalid star');
      }
    }

    const planet = await Planet.create({
      name,
      size: size === '' ? null : size,
      description,
      image: req.file
        ? `/uploads/${req.file.filename}`
        : null
    });

    if (star) {
      await planet.addStar(star);
    }

    res.redirect(303, '/planets');
  } catch (error) {
    console.error(error);
    res.status(400).send('Unable to create planet');
  }
});

// Display Edit Planet form
router.get('/:id/edit', async (req, res) => {
  try {
    const planet = await Planet.findByPk(req.params.id, {
      include: [{ model: Star, as: 'stars' }]
    });

    if (!planet) {
      return res.status(404).send('Planet not found');
    }

    const stars = await Star.findAll({
      order: [['name', 'ASC']]
    });

    res.render('planets/edit', { planet, stars });
  } catch (error) {
    console.error(error);
    res.status(500).send('Unable to load planet');
  }
});

// Update a planet
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const planet = await Planet.findByPk(req.params.id);

    if (!planet) {
      return res.status(404).send('Planet not found');
    }

    const { name, size, description, starId } = req.body;

    if (!name?.trim()) {
      return res.status(400).send('Planet name is required');
    }

    let star = null;

    if (starId) {
      star = await Star.findByPk(starId);

      if (!star) {
        return res.status(400).send('Invalid star');
      }
    }

    await planet.update({
      name,
      size: size === '' ? null : size,
      description,
      image: req.file
        ? `/uploads/${req.file.filename}`
        : planet.image
    });

    await planet.setStars(star ? [star] : []);

    res.redirect(303, '/planets');
  } catch (error) {
    console.error(error);
    res.status(400).send('Unable to update planet');
  }
});

// Delete a planet
router.delete('/:id', async (req, res) => {
  try {
    const planet = await Planet.findByPk(req.params.id);

    if (!planet) {
      return res.status(404).send('Planet not found');
    }

    await planet.destroy();
    res.redirect(303, '/planets');
  } catch (error) {
    console.error(error);
    res.status(500).send('Unable to delete planet');
  }
});

module.exports = router;