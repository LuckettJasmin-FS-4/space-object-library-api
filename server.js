const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const { sequelize, Galaxy, Star, Planet } = require('./models');
const galaxyRoutes = require('./routes/galaxies');
const starRoutes = require('./routes/stars');
const planetRoutes = require('./routes/planets');


const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON requests
app.use(express.json());

// Parse HTML form submissions
app.use(express.urlencoded({ extended: true }));

// Support PUT and DELETE from HTML forms
app.use(methodOverride('_method'));

// Configure EJS template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve CSS and uploaded images
app.use(express.static(path.join(__dirname, 'public')));

// Space Library Tracker dashboard
app.get('/', (req, res) => {
    res.render('index');
  });

// Helper to create CRUD endpoints
function registerRoutes(path, Model, include = []) {
  // CREATE
  app.post(path, async (req, res) => {
    try {
      const item = await Model.create(req.body);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // READ ALL
  app.get(path, async (req, res) => {
    try {
      const items = await Model.findAll({ include });
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // READ ONE
  app.get(`${path}/:id`, async (req, res) => {
    try {
      const item = await Model.findByPk(req.params.id, { include });

      if (!item) {
        return res.status(404).json({ error: 'Not found' });
      }

      res.json(item);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // UPDATE
  app.put(`${path}/:id`, async (req, res) => {
    try {
      const item = await Model.findByPk(req.params.id);

      if (!item) {
        return res.status(404).json({ error: 'Not found' });
      }

      await item.update(req.body);
      res.json(item);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // DELETE
  app.delete(`${path}/:id`, async (req, res) => {
    try {
      const item = await Model.findByPk(req.params.id);

      if (!item) {
        return res.status(404).json({ error: 'Not found' });
      }

      await item.destroy();
      res.json({ message: 'Deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
}

// Browser-based Galaxy management
app.use('/galaxies', galaxyRoutes);

// Browser-based Star management
app.use('/stars', starRoutes);

app.use('/planets', planetRoutes);

// Register all three resources
registerRoutes('/api/galaxies', Galaxy, [
  { model: Star, as: 'stars' }
]);

registerRoutes('/api/stars', Star, [
  { model: Galaxy, as: 'galaxy' },
  { model: Planet, as: 'planets' }
]);

registerRoutes('/api/planets', Planet, [
  { model: Star, as: 'stars' }
]);

 // Link a planet to a star
 app.post('/api/stars/:starId/planets/:planetId', async (req, res) => {
    try {
      const star = await Star.findByPk(req.params.starId);
      const planet = await Planet.findByPk(req.params.planetId);
  
      if (!star || !planet) {
        return res.status(404).json({
          error: 'Star or planet not found'
        });
      }
  
      await star.addPlanet(planet);
  
      res.status(200).json({
        message: 'Planet linked to star successfully',
        starId: star.id,
        planetId: planet.id
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Remove a planet from a star
  app.delete('/api/stars/:starId/planets/:planetId', async (req, res) => {
    try {
      const star = await Star.findByPk(req.params.starId);
      const planet = await Planet.findByPk(req.params.planetId);
  
      if (!star || !planet) {
        return res.status(404).json({
          error: 'Star or planet not found'
        });
      }
  
      await star.removePlanet(planet);
  
      res.json({
        message: 'Planet unlinked from star successfully'
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
// Start server only after database connection succeeds
sequelize.authenticate()
  .then(() => {
    console.log('Database connected successfully');

    app.listen(PORT, () => {
      console.log(`Space Object Library API running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
    process.exit(1);
  });
