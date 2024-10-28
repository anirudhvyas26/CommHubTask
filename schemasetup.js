// schemasetup.js
const pool = require('./db');

const createHypertable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sensor_data (
        time TIMESTAMPTZ NOT NULL,
        sensor_id INTEGER,
        temperature DOUBLE PRECISION,
        humidity DOUBLE PRECISION
      );
    `);

    await pool.query("SELECT create_hypertable('sensor_data', 'time');");
    console.log('Hypertable created successfully.');
  } catch (err) {
    console.error('Error creating hypertable:', err);
  }
};

// Ensure the function is exported correctly
module.exports = createHypertable;
