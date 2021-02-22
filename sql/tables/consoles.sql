CREATE TYPE HOME_OR_HANDHELD AS ENUM ('home', 'handheld');
CREATE TABLE consoles (
    console VARCHAR(255) CONSTRAINT console_key PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    year_released BIGINT NOT NULL,
    global_sales DECIMAL(5, 2),
    console_type HOME_OR_HANDHELD NOT NULL,
    maker VARCHAR(255) REFERENCES console_makers (maker) NOT NULL
);
COPY consoles (
    console,
    full_name,
    year_released,
    global_sales,
    maker,
    console_type
)
FROM 'C:\Users\jtr21\Desktop\WebDev\sites\vg_sales\server\src\sql\imports\consoles.csv' WITH (FORMAT CSV, HEADER);