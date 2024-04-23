import pg from "pg";

export const client = new pg.Client(
  "postgresql://postgres:mysecretpassword@localhost:5432/postgres"
);

const connectPostgres = async () => {
  try {
    await client.connect();
    console.log(`Postgres Connected: ${client.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectPostgres;
