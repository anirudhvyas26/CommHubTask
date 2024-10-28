const { client, connectToDatabase, disconnectFromDatabase } = require('./db');

// Ensure logs table exists
const createLogsTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS logs (
            timestamp TIMESTAMPTZ PRIMARY KEY,
            record_count INT,
            sum_processed_value NUMERIC
        );
    `;
    await client.query(query);
};

const logMetrics = async () => {
    const query = `
        INSERT INTO logs (timestamp, record_count, sum_processed_value)
        SELECT 
            NOW(),
            COUNT(*) AS record_count,
            SUM(processed_value_a + processed_value_b + processed_value_c + processed_value_d + processed_value_e) AS sum_processed_value
        FROM 
            processed_data
        WHERE 
            timestamp >= NOW() - INTERVAL '10 minutes';
    `;

    try {
        await client.query(query);
        console.log('Metrics logged successfully.');
    } catch (error) {
        console.error('Error logging metrics:', error.stack);
    }
};

// Function to schedule the logging every 10 minutes
const scheduleLogging = () => {
    logMetrics(); // Run the logging immediately
    setInterval(logMetrics, 10 * 60 * 1000); // Schedule to run every 10 minutes
};

const runLogging = async () => {
    await connectToDatabase();
    await createLogsTable(); // Ensure the logs table is created
    scheduleLogging(); // Start logging
};

// Start the logging process
runLogging().catch(error => {
    console.error('Error starting logging process:', error.stack);
});

// Add a listener for process exit to disconnect from the database
process.on('SIGINT', async () => {
    console.log('Disconnecting from database...');
    await disconnectFromDatabase();
    process.exit();
});
