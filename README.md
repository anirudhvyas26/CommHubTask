Data Pipeline Project
This project aims to build a data pipeline for ingesting, processing, aggregating, and logging time-series data using Node.js, TimescaleDB, and Docker.

Database Tables
1. raw_data Table
Purpose: Stores raw data ingested from CSV files or other sources, holding minute-level data entries before any processing.
Structure:
timestamp (TIMESTAMPTZ): Unique timestamp for each entry.
var_a, var_b, var_c, var_d, var_e (NUMERIC): Raw variable values to be processed.
2. processed_data Table
Purpose: Stores data transformed from the original raw_data. Each variable's value is scaled to prepare it for further analysis and aggregation.
Structure:
timestamp (TIMESTAMPTZ): Corresponds to each entry in raw_data, indicating when the data was originally collected.
processed_value_a to processed_value_e (NUMERIC): Scaled values of each variable (a through e) after transformation.
3. hourly_aggregated_data Table
Purpose: Stores hourly averages for each processed variable, simplifying trend analysis and providing insights into data patterns over time.
Structure:
hour (TIMESTAMPTZ): Hourly timestamp representing the period for which data is aggregated.
average_value_a to average_value_e (NUMERIC): Average values of each processed variable (a through e) for the respective hour.
4. logs Table
Purpose: Records metrics every 10 minutes, capturing key performance indicators such as the count of recent entries in the processed_data table and the sum of their processed values.
Structure:
timestamp (TIMESTAMPTZ): Indicates when the metrics were logged.
record_count (INT): Count of entries in the processed_data table added within the last 10 minutes.
sum_processed_value (NUMERIC): Total sum of processed values for the entries counted in the record_count column.

6. Scripts Overview
   
5.1db.js: Sets up a connection to a PostgreSQL database using the pg library.
   
5.2app.js: Runs the data ingestion script.

5.3aggregateHourlyData.js: Connects to the TimescaleDB database, creates an hourly_aggregated_data table if it doesn't exist, and inserts average values of processed variables from the processed_data table, grouped by hour.

5.4checkDataConsistency.js: Checks the consistency of data between the raw_data and processed_data tables by counting records and verifying that processed values match expected values based on raw data transformations.

5.5checkLogs.js: Retrieves and displays all logged metrics from the logs table, showing the timestamp, record count, and sum of processed values for each entry.

5.6dataTransform.js: Transforms data from the raw_data table by applying a scaling factor and inserts processed values into the processed_data table, avoiding duplicates based on timestamps.

5.7index.js: Connects to a PostgreSQL database, fetches the current time, logs it to the console, and ensures proper closure of the database client.

5.8insertTenMinData.js: Inserts ten rows of randomly generated test data into the processed_data table to check functionality.

5.9logMetrics.js: Connects to a PostgreSQL database, creates a logs table if it doesn't exist, logs metrics from the processed_data table every 10 minutes, and ensures proper disconnection from the database on exit.

5.10.sql file: Contains the schemas used for creating tables.
