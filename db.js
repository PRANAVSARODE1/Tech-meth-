require("dotenv").config();
const mysql = require("mysql2/promise");

const baseConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
};

const rawDbName = process.env.DB_NAME;
const dbName = /^[a-zA-Z0-9_]+$/.test(rawDbName || "") ? rawDbName : null;

function validateConfig() {
  if (!baseConfig.host || !baseConfig.user || baseConfig.password === undefined || !dbName) {
    throw new Error("Missing required DB config. Set DB_HOST, DB_USER, DB_PASSWORD, DB_NAME in .env.");
  }
}

async function initDatabase() {
  validateConfig();

  const conn = await mysql.createConnection(baseConfig);
  try {
    await conn.query(
      `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    await conn.query(`USE \`${dbName}\``);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        email VARCHAR(255) NOT NULL,
        role ENUM('student', 'teacher') NOT NULL,
        password VARCHAR(255) NOT NULL,
        PRIMARY KEY (id),
        UNIQUE KEY uq_users_email_role (email, role)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    const [columns] = await conn.query("SHOW COLUMNS FROM users LIKE 'password'");
    if (columns.length > 0) {
      await conn.query("ALTER TABLE users CHANGE COLUMN password password VARCHAR(255) NOT NULL");
    }
  } catch (error) {
    throw new Error(`Database initialization failed: ${error.message}`);
  } finally {
    await conn.end();
  }
}

validateConfig();

const pool = mysql.createPool({
  ...baseConfig,
  database: dbName,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = { pool, initDatabase };
