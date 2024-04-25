import pg from "pg";
import fs from "fs";
import path from "node:path";

const local_client = new pg.Client({
  user: "postgres",
  password: "mysecretpassword",
  host: "localhost",
  port: 5432,
  database: "postgres",
});

const client = local_client;

try {
  await client.connect();
  console.log("Connected to PostgreSQL database");
} catch (err) {
  console.error("Error connecting to PostgreSQL database", err);
}

try {
  const __dirname = path.resolve();
  const migrations_path = path.join(__dirname, "/data/migrations");
  const files = fs.readdirSync(migrations_path);
  for (const file of files) {
    var sql = fs.readFileSync(path.join(migrations_path, file)).toString();
    await client.query(sql);
  }
  console.log("Migrations successfull");
} catch (err) {
  console.error("Error executing migratoins", err);
}

try {
  await client.query(
    `INSERT INTO customer
    (first_name, last_name, gender, birthday)
    VALUES
    ('Max', 'Mustermann', 'male', '2000-01-01' ),
    ('Julia', 'Mustermann', 'female', '2007-01-01' )
    `
  );

  await client.query(
    `INSERT INTO product
      (category, type, brand, price, image)
    VALUES
      ('Boots', 'Ankle', 'A. Testony', 39.99, '7965307.5291.jpg'),
      ('Sandals', 'Athletic', 'adidas', 89.99, '115220.151.jpg')`
  );

  await client.query(
    `INSERT INTO purchase
      (customer_id, product_id, purchase_time)
    VALUES
      ('1', '1', '2022-02-22T22:00:00.000Z'),
      ('2', '1', '2022-02-23T22:00:00.000Z'),
      ('1', '2', '2022-02-22T23:00:00.000Z')
      `
  );

  let result = await client.query("SELECT * FROM customer");
  console.log(result.rows);

  result = await client.query("SELECT * FROM product");
  console.log(result.rows);

  result = await client.query("SELECT * FROM purchase");
  console.log(result.rows);
} catch (err) {
  console.error("Error inserting data", err);
} finally {
  if (client) {
    client.end(); // workaround fix
  }
}
