CREATE TABLE logs (
    timestamp TIMESTAMPTZ PRIMARY KEY,
    record_count INT,
    sum_processed_value NUMERIC
);
--insert query
INSERT INTO logs (timestamp, record_count, sum_processed_value)
SELECT 
    NOW(),
    COUNT(*) AS record_count,
    SUM(processed_value) AS sum_processed_value
FROM 
    processed_data
WHERE 
    timestamp >= NOW() - INTERVAL '10 minutes';
