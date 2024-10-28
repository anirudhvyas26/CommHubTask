const { client, connectToDatabase, disconnectFromDatabase } = require('./db');

const checkDataConsistency = async () => {
    // Log counts of records before checking consistency
    const countQuery = `
        SELECT 
            (SELECT COUNT(*) FROM raw_data) AS raw_data_count,
            (SELECT COUNT(*) FROM processed_data) AS processed_data_count;
    `;

    try {
        const countRes = await client.query(countQuery);
        console.log(`Raw Data Count: ${countRes.rows[0].raw_data_count}`);
        console.log(`Processed Data Count: ${countRes.rows[0].processed_data_count}`);
    } catch (error) {
        console.error('Error counting records:', error.stack);
    }

    const query = `
        SELECT r.timestamp
        FROM raw_data r
        LEFT JOIN processed_data p ON r.timestamp = p.timestamp
        WHERE p.timestamp IS NULL;
    `;

    try {
        const res = await client.query(query);
        if (res.rows.length > 0) {
            console.log('Inconsistent records found (timestamps in raw_data without matching processed_data):');
            res.rows.forEach(row => {
                console.log(row.timestamp);
            });
        } else {
            console.log('All records in raw_data have matching records in processed_data.');
        }
    } catch (error) {
        console.error('Error checking data consistency:', error.stack);
    }
};

const checkDataAndValueConsistency = async () => {
    const query = `
        SELECT 
            r.timestamp,
            r.var_a * 0.01667 AS expected_processed_value_a,
            p.processed_value_a,
            r.var_b * 0.01667 AS expected_processed_value_b,
            p.processed_value_b,
            r.var_c * 0.01667 AS expected_processed_value_c,
            p.processed_value_c,
            r.var_d * 0.01667 AS expected_processed_value_d,
            p.processed_value_d,
            r.var_e * 0.01667 AS expected_processed_value_e,
            p.processed_value_e
        FROM 
            raw_data r
        LEFT JOIN 
            processed_data p ON r.timestamp = p.timestamp
        WHERE 
            p.timestamp IS NULL OR 
            (p.processed_value_a <> r.var_a * 0.01667 OR 
             p.processed_value_b <> r.var_b * 0.01667 OR 
             p.processed_value_c <> r.var_c * 0.01667 OR 
             p.processed_value_d <> r.var_d * 0.01667 OR 
             p.processed_value_e <> r.var_e * 0.01667);
    `;

    try {
        const res = await client.query(query);
        if (res.rows.length > 0) {
            console.log('Inconsistent records found:');
            res.rows.forEach(row => {
                console.log(`Timestamp: ${row.timestamp}`);
                console.log(`Expected Values: [${row.expected_processed_value_a}, ${row.expected_processed_value_b}, ${row.expected_processed_value_c}, ${row.expected_processed_value_d}, ${row.expected_processed_value_e}]`);
                console.log(`Processed Values: [${row.processed_value_a}, ${row.processed_value_b}, ${row.processed_value_c}, ${row.processed_value_d}, ${row.processed_value_e}]`);
            });
        } else {
            console.log('All records are consistent.');
        }
    } catch (error) {
        console.error('Error checking data value consistency:', error.stack);
    }
};

const runConsistencyCheck = async () => {
    await connectToDatabase();
    await checkDataConsistency();
    await checkDataAndValueConsistency(); // Added value consistency check
    await disconnectFromDatabase();
};

// Start the consistency check
runConsistencyCheck();
