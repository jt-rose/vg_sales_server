CREATE TABLE console_makers (
    maker VARCHAR(255) CONSTRAINT maker_key PRIMARY KEY
);
COPY console_makers (maker)
FROM 'C:\Users\jtr21\Desktop\WebDev\sites\vg_sales\server\src\sql\imports\console_makers.csv' WITH (FORMAT CSV, HEADER);