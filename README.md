This project aims to build a data pipeline for ingesting, processing, aggregating, and logging time-series data using Node.js, TimescaleDB, and Docker.

1. raw_data Table
Purpose: Stores raw data ingested from CSV files or other sources, holding minute-level data entries before any processing.
Structure:
timestamp (TIMESTAMPTZ): Unique timestamp for each entry.
var_a, var_b, var_c, var_d, var_e (NUMERIC): Raw variable values to be processed.

2.processed_data Table
Purpose: The processed_data table stores data that has been transformed from the original raw_data. Each variable's value is scaled to prepare it for further analysis and aggregation.
Structure:
timestamp (TIMESTAMPTZ): The timestamp corresponds to each entry in raw_data, indicating when the data was originally collected.
processed_value_a to processed_value_e (NUMERIC): These columns contain the scaled values of each variable (a through e) after transformation. The transformations prepare the data for the hourly averaging and other metrics calculations.


3.hourly_aggregated_data Table
Purpose: The hourly_aggregated_data table stores hourly averages for each processed variable. By summarizing data on an hourly basis, it helps to simplify trend analysis and provides insights into data patterns over time.
Structure:
hour (TIMESTAMPTZ): The hourly timestamp representing the period for which data is aggregated.
average_value_a to average_value_e (NUMERIC): These columns hold the average values of each processed variable (a through e) for the respective hour.

4. logs Table
Purpose: The logs table is designed to record metrics every 10 minutes. It captures key performance indicators such as the count of recent entries in the processed_data table and the sum of their processed values. This enables ongoing monitoring and analysis of data flow within the system.
Structure:
timestamp (TIMESTAMPTZ): The timestamp indicates when the metrics were logged.
record_count (INT): The count of entries in the processed_data table that were added within the last 10 minutes.
sum_processed_value (NUMERIC): The total sum of processed values for the entries counted in the record_count column.

