CREATE TABLE console_makers (
    maker VARCHAR(255) CONSTRAINT maker_key PRIMARY KEY
);
COPY console_makers (maker)
FROM '/Users/jeffreyrose/Desktop/WebDev/vg_sales_server/sql/imports/console_makers.csv' WITH (FORMAT CSV, HEADER);