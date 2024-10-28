. Raw Data Table Creation and Data Ingestion
Objective: Set up a raw_data table to store raw, minute-level data.
Steps:
Created the raw_data table with fields for timestamp and several variable values.
Developed a Node.js script to read data from a CSV file and insert it into raw_data for ingestion.
Outcome: raw_data is now populated with time-series data from a CSV file.

Objective: Transform raw data values and store them in processed_data table.
Steps:
Created the processed_data table to store processed values derived from raw_data.
Applied transformations (multiplied by a factor) to raw data values and stored the results.
Outcome: Transformed values are successfully stored in processed_data, prepared for
