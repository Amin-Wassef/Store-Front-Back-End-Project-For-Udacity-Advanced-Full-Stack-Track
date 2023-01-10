CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    user_name VARCHAR(50) NOT NULL,
    e_mail VARCHAR(75) NOT NULL,
    password VARCHAR(200) NOT NULL
);