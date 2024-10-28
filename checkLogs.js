const { client, connectToDatabase, disconnectFromDatabase } = require('./db');

const checkLogs = async () => {
    const query = 'SELECT * FROM logs ORDER BY timestamp DESC;';

    try {
        const res = await client.query(query);
        console.log('Metrics logged in the logs table:');
        res.rows.forEach(row => {
            console.log(`Timestamp: ${row.timestamp}, Record Count: ${row.record_count}, Sum Processed Value: ${row.sum_processed_value}`);
        });
    } catch (error) {
        console.error('Error fetching logs:', error.stack);
    }
};

const runCheck = async () => {
    await connectToDatabase();
    await checkLogs();
    await disconnectFromDatabase();
};

// Start the check process
runCheck();

