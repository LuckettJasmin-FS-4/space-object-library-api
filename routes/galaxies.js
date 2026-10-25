const express = require('express');
const { Galaxy } = require('../models');
const upload = require('../middleware/upload');

const router = express.Router();

// Display all galaxies
router.get('/', async (req, res) => {
  try {
    const galaxies = await Galaxy.findAll({
      order: [['id', 'ASC']]
    });

    res.render('galaxies/index', { galaxies });
  } catch (error) {
    console.error(error);
    res.status(500).send('Unable to load galaxies');
  }
});

// Display the Add Galaxy form
router.get('/new', (req, res) => {
  res.render('galaxies/new');
});

// Create a new galaxy
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, size, description } = req.body;

    await Galaxy.create({
            name,
            size: size === '' ? null : size,
            description,
            image: req.file 
            ? `/uploads/${req.file.filename}` 
            : null
          });

    res.redirect(303, '/galaxies');
  } catch (error) {
    console.error(error);
    res.status(400).send('Unable to create galaxy');
  }
});

// Display Edit Galaxy form
router.get('/:id/edit', async (req, res) => {
    try {
      const galaxy = await Galaxy.findByPk(req.params.id);
  
      if (!galaxy) {
        return res.status(404).send('Galaxy not found');
      }
  
      res.render('galaxies/edit', { galaxy });
    } catch (error) {
      console.error(error);
      res.status(500).send('Unable to load galaxy');
    }
  });
  
  // Update an existing galaxy
  router.put('/:id', upload.single('image'), async (req, res) => {
    try {
      const galaxy = await Galaxy.findByPk(req.params.id);
  
      if (!galaxy) {
        return res.status(404).send('Galaxy not found');
      }
  
      const { name, size, description } = req.body;
  
     
      await galaxy.update({
        name,
        size: size === '' ? null : size,
        description,
        image: req.file
          ? `/uploads/${req.file.filename}`
          : galaxy.image
      });
  
      res.redirect(303, '/galaxies');
    } catch (error) {
      console.error(error);
      res.status(400).send('Unable to update galaxy');
    }
  });
  
  // Delete a galaxy
  router.delete('/:id', async (req, res) => {
    try {
      const galaxy = await Galaxy.findByPk(req.params.id);
  
      if (!galaxy) {
        return res.status(404).send('Galaxy not found');
      }
  
      await galaxy.destroy();
      res.redirect(303, '/galaxies');
    } catch (error) {
      console.error(error);
      res.status(500).send('Unable to delete galaxy');
    }
  });
module.exports = router;