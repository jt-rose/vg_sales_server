CREATE TABLE saved_searches (
    saved_search_id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) REFERENCES users(user_email),
    search_settings JSONB NOT NULL
);