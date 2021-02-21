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
    "name" VARCHAR(255) NOT NULL,
    console VARCHAR(255) REFERENCES consoles (console) NOT NULL,
    Year_of_Release BIGINT NOT NULL,
    Genre GENRE_TYPE NOT NULL,
    Publisher VARCHAR(255) NOT NULL CHECK (Publisher != 'unknown'),
    NA_players DECIMAL(4, 2) NOT NULL CHECK (NA_players >= 0),
    EU_players DECIMAL(4, 2) NOT NULL CHECK (EU_players >= 0),
    JP_players DECIMAL(4, 2) NOT NULL CHECK (JP_players >= 0),
    Other_players DECIMAL(4, 2) NOT NULL CHECK (Other_players >= 0),
    Global_players DECIMAL(4, 2) NOT NULL CHECK (Global_players >= 0),
    Critic_Score DECIMAL(4, 2) CHECK (Critic_Score >= 0),
    Critic_Count BIGINT CHECK (Critic_Count >= 0),
    User_Score DECIMAL(4, 2) CHECK (User_Score >= 0),
    User_Count BIGINT CHECK (User_Count >= 0),
    Developer VARCHAR(255),
    Rating RATING_TYPE,
    unique_by_name VARCHAR(255) NOT NULL UNIQUE,
    unique_by_year VARCHAR(255) NOT NULL UNIQUE
);
COPY games (
    "id",
    "name",
    console,
    Year_of_Release,
    Genre,
    Publisher,
    NA_players,
    EU_players,
    JP_players,
    Other_players,
    Global_players,
    Critic_Score,
    Critic_Count,
    User_Score,
    User_Count,
    Developer,
    Rating,
    unique_by_name,
    unique_by_year
)
FROM 'C:\Users\jtr21\Desktop\WebDev\sites\vg_sales\server\src\sql\imports\games.csv' WITH (FORMAT CSV, HEADER);