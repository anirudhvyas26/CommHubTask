const { Client } = require('pg');

// Create a new client instance
const client = new Client({
  user: 'tsdbadmin',               // Match the user defined in your Docker command
  host: 'bu4bmmmibz.gdbvblsbal.tsdb.cloud.timescale.com', // Use 'localhost' for connections from your host machine
  database: 'tsdb',                // Match the database name defined in your Docker command
  password: 'hrhhe5h5lwo6vpxh',    // Match the password defined in your Docker command
  port: 37399,                     // Default PostgreSQL port
});

// Connect to the database
const connectToDatabase = async () => {
  try {
    await client.connect();
    console.log('Connected to TimescaleDB');
  } catch (err) {
    console.error('Error connecting to the database:', err);
  }
};

// Disconnect from the database
const disconnectFromDatabase = async () => {
  try {
    await client.end();
    console.log('Disconnected from TimescaleDB');
  } catch (err) {
    console.error('Error disconnecting from the database:', err);
  }
};

// Export the client and the connect/disconnect functions
module.exports = { client, connectToDatabase, disconnectFromDatabase };
