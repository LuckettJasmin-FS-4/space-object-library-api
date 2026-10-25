const express = require('express');
const { Star, Galaxy } = require('../models');
const upload = require('../middleware/upload');

const router = express.Router();

// Display all stars
router.get('/', async (req, res) => {
  try {
    const stars = await Star.findAll({
      include: [{ model: Galaxy, as: 'galaxy' }],
      order: [['id', 'ASC']]
    });

    res.render('stars/index', { stars });
  } catch (error) {
    console.error(error);
    res.status(500).send('Unable to load stars');
  }
});

// Display Add Star form
router.get('/new', async (req, res) => {
  try {
    const galaxies = await Galaxy.findAll({
      order: [['name', 'ASC']]
    });

    res.render('stars/new', { galaxies });
  } catch (error) {
    console.error(error);
    res.status(500).send('Unable to load form');
  }
});

// Create a star
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, size, description, galaxyId } = req.body;

    if (!name?.trim()) {
      return res.status(400).send('Star name is required');
    }

    if (galaxyId && !await Galaxy.findByPk(galaxyId)) {
      return res.status(400).send('Invalid galaxy');
    }

    await Star.create({
      name,
      size: size === '' ? null : size,
      description,
      galaxyId: galaxyId || null,
      image: req.file ? `/uploads/${req.file.filename}` : null
    });

    res.redirect(303, '/stars');
  } catch (error) {
    console.error(error);
    res.status(400).send('Unable to create star');
  }
});

// Display Edit Star form
router.get('/:id/edit', async (req, res) => {
  try {
    const star = await Star.findByPk(req.params.id);

    if (!star) {
      return res.status(404).send('Star not found');
    }

    const galaxies = await Galaxy.findAll({
      order: [['name', 'ASC']]
    });

    res.render('stars/edit', { star, galaxies });
  } catch (error) {
    console.error(error);
    res.status(500).send('Unable to load star');
  }
});

// Update a star
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const star = await Star.findByPk(req.params.id);

    if (!star) {
      return res.status(404).send('Star not found');
    }

    const { name, size, description, galaxyId } = req.body;

    if (!name?.trim()) {
      return res.status(400).send('Star name is required');
    }

    if (galaxyId && !await Galaxy.findByPk(galaxyId)) {
      return res.status(400).send('Invalid galaxy');
    }

    await star.update({
      name,
      size: size === '' ? null : size,
      description,
      galaxyId: galaxyId || null,
      image: req.file
        ? `/uploads/${req.file.filename}`
        : star.image
    });

    res.redirect(303, '/stars');
  } catch (error) {
    console.error(error);
    res.status(400).send('Unable to update star');
  }
});

// Delete a star
router.delete('/:id', async (req, res) => {
  try {
    const star = await Star.findByPk(req.params.id);

    if (!star) {
      return res.status(404).send('Star not found');
    }

    await star.destroy();
    res.redirect(303, '/stars');
  } catch (error) {
    console.error(error);
    res.status(500).send('Unable to delete star');
  }
});

module.exports = router;