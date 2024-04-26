DROP TABLE IF EXISTS product;
CREATE TABLE product (
  id SERIAL PRIMARY KEY,
  category VARCHAR(255),
  type VARCHAR(255),
  brand VARCHAR(255),
  price FLOAT,
  image VARCHAR(255),
  image_url VARCHAR(255)
);