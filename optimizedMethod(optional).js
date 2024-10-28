const fs = require('fs');
const path = require('path');
const { client, connectToDatabase, disconnectFromDatabase } = require('./db');

// Function to run SQL queries from a file
const runSQLFile = async (filePath) => {
  const fullPath = path.join(__dirname, filePath);
  const sql = fs.readFileSync(fullPath, { encoding: 'utf8' });

  try {
    await client.query(sql);
    console.log(`Executed SQL from ${filePath} successfully.`);
  } catch (error) {
    console.error(`Error executing SQL from ${filePath}:`, error.stack);
  }
};

// Function to load data from CSV and insert it into the database using COPY
const loadCSVData = async (filePath) => {
  const query = `
    COPY raw_data (timestamp, var_a, var_b, var_c, var_d, var_e) 
    FROM '${filePath}' 
    DELIMITER ',' 
    CSV HEADER;
  `;

  try {
    await client.query(query);
    console.log('Data ingestion complete using COPY command.');
  } catch (error) {
    console.error('Error ingesting data using COPY command:', error.stack);
  }
};

// Main function to run setup and data ingestion
const runApp = async () => {
  await connectToDatabase();

  // Run the SQL files to create the table and hypertable
  await runSQLFile('create_raw_data_table.sql');
  await runSQLFile('create_hypertable.sql');

  // Load data from the CSV file
  await loadCSVData('raw_data.csv');

  // Uncomment if you want to close the database connection at the end
  // await disconnectFromDatabase();
};

// Start the application
runApp();
