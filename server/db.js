import pg from "pg";

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "clinic",
  password: "mohamedaya111221",
  port: 5432,
});

db.connect();

export default db;
