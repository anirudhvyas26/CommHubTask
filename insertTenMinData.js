const { client, connectToDatabase, disconnectFromDatabase } = require('./db');

const insertTestData = async () => {
    const query = `
        DO $$
        BEGIN
            FOR i IN 0..9 LOOP
                INSERT INTO processed_data (timestamp, processed_value_a, processed_value_b, processed_value_c, processed_value_d, processed_value_e)
                VALUES (
                    NOW() - INTERVAL '1 minute' * i,
                    RANDOM() * 10,
                    RANDOM() * 10,
                    RANDOM() * 10,
                    RANDOM() * 10,
                    RANDOM() * 10
                );
            END LOOP;
        END $$;
    `;

    try {
        await client.query(query);
        console.log('Test data inserted successfully.');
    } catch (error) {
        console.error('Error inserting test data:', error.stack);
    }
};

const runInsertTestData = async () => {
    await connectToDatabase();
    await insertTestData();
    await disconnectFromDatabase();
};

// Start the insertion process
runInsertTestData();
