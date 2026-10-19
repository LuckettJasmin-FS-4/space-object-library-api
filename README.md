# Space Object Library API

A RESTful API built using Node.js, Express, Sequelize ORM, and SQLite for managing celestial objects.

## Features

- Full CRUD operations for Galaxies, Stars, and Planets
- Sequelize ORM database persistence
- One-to-many relationship between Galaxies and Stars
- Many-to-many relationship between Stars and Planets
- StarsPlanets join table
- JSON responses and HTTP status codes

## Technologies

- Node.js
- Express.js
- Sequelize ORM
- SQLite
- cURL

## Installation

```bash
npm install
npx sequelize-cli db:migrate
node server.js
```

The API runs at `http://localhost:3000`.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/galaxies | Retrieve galaxies |
| POST | /api/galaxies | Create a galaxy |
| GET | /api/galaxies/:id | Retrieve one galaxy |
| PUT | /api/galaxies/:id | Update a galaxy |
| DELETE | /api/galaxies/:id | Delete a galaxy |
| GET | /api/stars | Retrieve stars |
| POST | /api/stars | Create a star |
| GET | /api/stars/:id | Retrieve one star |
| PUT | /api/stars/:id | Update a star |
| DELETE | /api/stars/:id | Delete a star |
| GET | /api/planets | Retrieve planets |
| POST | /api/planets | Create a planet |
| GET | /api/planets/:id | Retrieve one planet |
| PUT | /api/planets/:id | Update a planet |
| DELETE | /api/planets/:id | Delete a planet |
| POST | /api/stars/:starId/planets/:planetId | Link planet to star |
| DELETE | /api/stars/:starId/planets/:planetId | Unlink planet from star |

## Database Models

Galaxy, Star, and Planet each contain name, size, and description fields.

Stars belong to Galaxies. Planets can belong to multiple Stars through the StarsPlanets join table.

## Testing

The API can be tested using cURL commands. The demonstration video shows CRUD operations and successful database responses.