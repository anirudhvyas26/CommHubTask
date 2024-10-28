DROP TABLE IF EXISTS hourly_aggregated_data;

CREATE TABLE hourly_aggregated_data (
  hour TIMESTAMPTZ PRIMARY KEY,
  average_value_a NUMERIC,
  average_value_b NUMERIC,
  average_value_c NUMERIC,
  average_value_d NUMERIC,
  average_value_e NUMERIC
);

--processed data--
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
