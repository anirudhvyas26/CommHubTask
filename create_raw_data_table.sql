DROP TABLE IF EXISTS raw_data;

CREATE TABLE raw_data (
  timestamp TIMESTAMPTZ PRIMARY KEY,
  var_a NUMERIC,
  var_b NUMERIC,
  var_c NUMERIC,
  var_d NUMERIC,
  var_e NUMERIC
);

-- Create processed_data table to hold processed values for each variable
CREATE TABLE processed_data (
  timestamp TIMESTAMPTZ PRIMARY KEY,
  processed_value_a NUMERIC,
  processed_value_b NUMERIC,
  processed_value_c NUMERIC,
  processed_value_d NUMERIC,
  processed_value_e NUMERIC
);
-- Create the function to calculate processed_value and insert it into processed_data
CREATE OR REPLACE FUNCTION calculate_processed_values()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert calculated processed values into processed_data
  INSERT INTO processed_data (timestamp, processed_value_a, processed_value_b, processed_value_c, processed_value_d, processed_value_e)
  VALUES (
    NEW.timestamp,
    NEW.var_a * 0.01667,  -- Processed value for var_a
    NEW.var_b * 0.01667,  -- Processed value for var_b
    NEW.var_c * 0.01667,  -- Processed value for var_c
    NEW.var_d * 0.01667,  -- Processed value for var_d
    NEW.var_e * 0.01667   -- Processed value for var_e
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on raw_data to execute the function after each insert
CREATE TRIGGER process_data_trigger
AFTER INSERT ON raw_data
FOR EACH ROW
EXECUTE FUNCTION calculate_processed_values();
