DROP TABLE IF EXISTS movies;

CREATE TABLE IF NOT EXISTS movies (
    id  SERIAL PRIMARY KEY, 
    title varchar(255),
    release_date DATE,
    overview varchar(255),
    personal_comment varchar(255)
);