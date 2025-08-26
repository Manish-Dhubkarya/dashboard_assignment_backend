require('dotenv').config({ debug: true }); // Enable debug for dotenv

const { Pool } = require('pg');

const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL, // Use connection string from .env
  ssl: {
    rejectUnauthorized: false, // Allow self-signed certificates
  },
  max: 10, // Connection pool limit
});

pgPool.on('error', (err) => {
  console.error('Unexpected error on idle client:', err);
});

module.exports = pgPool;