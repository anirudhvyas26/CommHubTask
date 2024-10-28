const { client, connectToDatabase, disconnectFromDatabase } = require('./db');

const transformData = async () => {
    const query = `
        INSERT INTO processed_data (timestamp, processed_value_a, processed_value_b, processed_value_c, processed_value_d, processed_value_e)
        SELECT timestamp, 
               var_a * 0.01667 AS processed_value_a,
               var_b * 0.01667 AS processed_value_b,
               var_c * 0.01667 AS processed_value_c,
               var_d * 0.01667 AS processed_value_d,
               var_e * 0.01667 AS processed_value_e
        FROM raw_data
        WHERE timestamp NOT IN (SELECT timestamp FROM processed_data);
    `;
    try {
        await client.query(query);
        console.log('Data transformed and inserted into processed_data successfully.');
    } catch (error) {
        console.error('Error transforming data:', error.stack);
    }
};

const runTransformation = async () => {
    await connectToDatabase();
    await transformData();
    await disconnectFromDatabase();
};

// Start the transformation
runTransformation();
