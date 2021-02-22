CREATE TYPE RATING_TYPE AS ENUM (
    'T',
    'E10+',
    'M',
    'K-A',
    'E',
    'EC',
    'AO',
    'RP'
);
CREATE TYPE GENRE_TYPE AS ENUM (
    'Action',
    'Adventure',
    'Fighting',
    'Misc',
    'Platform',
    'Puzzle',
    'Racing',
    'Role-Playing',
    'Shooter',
    'Simulation',
    'Sports',
    'Strategy'
);
CREATE TABLE games (
    -- id was generated before upload so it could be referenced 
    -- in unique_by_year and unique_by_name
    "id" BIGINT CONSTRAINT game_id_key PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    console VARCHAR(255) REFERENCES consoles (console) NOT NULL,
    year_of_release BIGINT NOT NULL,
    genre GENRE_TYPE NOT NULL,
    publisher VARCHAR(255) NOT NULL CHECK (publisher != 'unknown'),
    na_sales DECIMAL(4, 2) NOT NULL CHECK (na_sales >= 0),
    eu_sales DECIMAL(4, 2) NOT NULL CHECK (eu_sales >= 0),
    jp_sales DECIMAL(4, 2) NOT NULL CHECK (jp_sales >= 0),
    other_sales DECIMAL(4, 2) NOT NULL CHECK (other_sales >= 0),
    global_sales DECIMAL(4, 2) NOT NULL CHECK (global_sales >= 0),
    critic_score DECIMAL(4, 2) CHECK (critic_score >= 0),
    critic_count BIGINT CHECK (critic_count >= 0),
    user_score DECIMAL(4, 2) CHECK (user_score >= 0),
    user_count BIGINT CHECK (user_count >= 0),
    developer VARCHAR(255),
    rating RATING_TYPE,
    unique_by_name VARCHAR(255) NOT NULL UNIQUE,
    unique_by_year VARCHAR(255) NOT NULL UNIQUE
);
COPY games (
    "id",
    title,
    console,
    year_of_release,
    genre,
    publisher,
    na_sales,
    eu_sales,
    jp_sales,
    other_sales,
    global_sales,
    critic_score,
    critic_count,
    user_score,
    user_count,
    developer,
    rating,
    unique_by_name,
    unique_by_year
)
FROM 'C:\Users\jtr21\Desktop\WebDev\sites\vg_sales\server\src\sql\imports\games.csv' WITH (FORMAT CSV, HEADER);
CREATE INDEX title_idx ON games (title);