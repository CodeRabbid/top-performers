DROP TABLE IF EXISTS product;
CREATE TABLE product (
  id SERIAL PRIMARY KEY,
  type VARCHAR(255),
  model VARCHAR(255),
  brand VARCHAR(255),
  price FLOAT,
  image VARCHAR(255)
);