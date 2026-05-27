import "dotenv/config";
import mysql from "mysql2/promise";

const db = await mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
  ssl: { rejectUnauthorized: false },
});

console.log("🧹 מוחק טבלאות ישנות אם הן קיימות...");
// מחיקה בסדר נכון כדי למנוע שגיאות Foreign Key
await db.query(`DROP TABLE IF EXISTS user_companies`);
await db.query(`DROP TABLE IF EXISTS donors`);
await db.query(`DROP TABLE IF EXISTS users`);
await db.query(`DROP TABLE IF EXISTS companies`);

console.log("🛠️ יוצר את הטבלאות החדשות והמעודכנות...");

// 1. טבלת חברות (כולל השדות החדשים לרישום, לוגו וצבע)
await db.query(`
  CREATE TABLE companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    logo_path VARCHAR(255),
    about_text TEXT,
    fundraising_goal VARCHAR(100),
    company_color VARCHAR(7) DEFAULT '#1094A9'
  )
`);

// 2. טבלת משתמשים (הטבלה המקורית שלך)
await db.query(`
  CREATE TABLE users (
    id INT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    city VARCHAR(100),
    job VARCHAR(100),
    status ENUM('married', 'single'),
    age INT
  )
`);

// 3. טבלת קשר בין משתמשים לחברות
await db.query(`
  CREATE TABLE user_companies (
    user_id INT NOT NULL,
    company_id INT NOT NULL,
    PRIMARY KEY (user_id, company_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
  )
`);

// 4. טבלת תורמים (עבור קובצי ה-CSV שהחברות יעלו)
await db.query(`
  CREATE TABLE donors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    tz_number VARCHAR(20) NOT NULL,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
  )
`);

console.log("🚀 מסד הנתונים אותחל ועודכן בהצלחה מלאה!");
await db.end();