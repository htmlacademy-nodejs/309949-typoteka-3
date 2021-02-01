CREATE DATABASE typoteka
    WITH
    OWNER = typoteka
    ENCODING = 'UTF8'
    LC_COLLATE = 'C'
    LC_CTYPE = 'C'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

GRANT ALL ON DATABASE typoteka TO typoteka;

DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS comments;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    avatar VARCHAR(100),
    created_at DATE,
    updated_at DATE,
    deleted_at DATE
);

CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    announce TEXT NOT NULL,
    fullText TEXT NOT NULL,
    image VARCHAR(100),
    author_id INTEGER,
    created_at DATE,
    updated_at DATE,
    deleted_at DATE,
    FOREIGN KEY (author_id) REFERENCES users (id)
        ON DELETE SET NULL
        ON UPDATE SET NULL
);

CREATE INDEX idx_article_title ON articles(title);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    user_id INTEGER,
    article_id INTEGER,
    created_at DATE,
    updated_at DATE,
    deleted_at DATE,
    FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE SET NULL
        ON UPDATE SET NULL,
    FOREIGN KEY (article_id) REFERENCES articles (id)
        ON DELETE SET NULL
        ON UPDATE SET NULL
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at DATE,
    updated_at DATE,
    deleted_at DATE
);

CREATE TABLE articles_categories (
    category_id INTEGER NOT NULL,
    article_id INTEGER NOT NULL,
    CONSTRAINT categories_offers_pk PRIMARY KEY (category_id, article_id),
    FOREIGN KEY (category_id) REFERENCES categories (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (article_id) REFERENCES articles (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
