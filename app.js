const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
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

// Function to insert data into the raw_data table with multiple variables
const insertData = async (timestamp, var_a, var_b, var_c, var_d, var_e) => {
  const query = `
    INSERT INTO raw_data (timestamp, var_a, var_b, var_c, var_d, var_e)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (timestamp) DO NOTHING; -- Avoids inserting duplicates
  `;
  try {
    await client.query(query, [timestamp, var_a, var_b, var_c, var_d, var_e]);
    console.log(`Inserted data for ${timestamp}`);
  } catch (error) {
    console.error('Error inserting data:', error.stack);
  }
};

// Function to load data from CSV and insert it into the database
const loadCSVData = async (filePath) => {
  const results = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        const timestamp = data.timestamp;
        const var_a = parseFloat(data.var_a);
        const var_b = parseFloat(data.var_b);
        const var_c = parseFloat(data.var_c);
        const var_d = parseFloat(data.var_d);
        const var_e = parseFloat(data.var_e);
        results.push({ timestamp, var_a, var_b, var_c, var_d, var_e });
      })
      .on('end', async () => {
        for (const row of results) {
          await insertData(row.timestamp, row.var_a, row.var_b, row.var_c, row.var_d, row.var_e);
        }
        console.log('Data ingestion complete.');
        resolve();
      })
      .on('error', (error) => {
        console.error('Error reading CSV file:', error);
        reject(error);
      });
  });
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
