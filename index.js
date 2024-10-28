// index.js
const { client, connectToDatabase } = require('./db');

(async () => {
  // Connect to the database
  await connectToDatabase();

  try {
    // Example query to fetch the current time
    const res = await client.query('SELECT NOW()');
    console.log('Current Time:', res.rows[0]);
  } catch (err) {
    console.error('Error executing query', err);
    await runQueriesFromFile('./path/to/insert_cars.sql');

  } finally {
    // Close the client when done
    await client.end();
  }
})();
