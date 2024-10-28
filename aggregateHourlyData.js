const { client, connectToDatabase, disconnectFromDatabase } = require('./db');

const aggregateHourlyData = async () => {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS hourly_aggregated_data (
            hour TIMESTAMPTZ PRIMARY KEY,
            average_value_a NUMERIC,
            average_value_b NUMERIC,
            average_value_c NUMERIC,
            average_value_d NUMERIC,
            average_value_e NUMERIC
        );
    `;

    const aggregateQuery = `
        INSERT INTO hourly_aggregated_data (hour, average_value_a, average_value_b, average_value_c, average_value_d, average_value_e)
        SELECT 
            date_trunc('hour', timestamp) AS hour,
            AVG(processed_value_a) AS average_value_a,
            AVG(processed_value_b) AS average_value_b,
            AVG(processed_value_c) AS average_value_c,
            AVG(processed_value_d) AS average_value_d,
            AVG(processed_value_e) AS average_value_e
        FROM 
            processed_data
        GROUP BY 
            hour
        ORDER BY 
            hour;
    `;

    try {
        // Connect to the database
        await connectToDatabase();
        
        // Create the hourly_aggregated_data table if it doesn't exist
        await client.query(createTableQuery);
        console.log('Table hourly_aggregated_data created or already exists.');

        // Aggregate the data into hourly_aggregated_data
        await client.query(aggregateQuery);
        console.log('Hourly averages calculated and inserted into hourly_aggregated_data successfully.');

    } catch (error) {
        console.error('Error during hourly aggregation:', error.stack);
    } finally {
        // Disconnect from the database
        await disconnectFromDatabase();
    }
};

// Start the aggregation process
aggregateHourlyData();
