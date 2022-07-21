import { Pool } from "pg";

const connection = new Pool({
  connectionString: process.env.DATABASE_URL
});

export default connection;