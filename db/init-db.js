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

// 1. מכבים זמנית את בדיקת ה-Foreign Keys כדי לאפשר מחיקה חלקה
await db.query(`SET FOREIGN_KEY_CHECKS = 0`);

// 2. מחיקת כל הטבלאות (כולל טבלת campaigns החדשה שלא הייתה ברשימה מקודם)
await db.query(`DROP TABLE IF EXISTS campaigns`);
await db.query(`DROP TABLE IF EXISTS user_companies`);
await db.query(`DROP TABLE IF EXISTS donors`);
await db.query(`DROP TABLE IF EXISTS users`);
await db.query(`DROP TABLE IF EXISTS companies`);
await db.query(`DROP TABLE IF EXISTS personalized_landings`);

// 3. מחזירים את בדיקת ה-Foreign Keys לפעולה
await db.query(`SET FOREIGN_KEY_CHECKS = 1`);


console.log("🛠️ יוצר את הטבלאות החדשות והמעודכנות...");

// 1. טבלת חברות
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

// 2. טבלת משתמשים
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

// 4. טבלת תורמים
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

// 5. טבלת קמפיינים
await db.query(`
  CREATE TABLE campaigns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    campaign_name VARCHAR(255) NOT NULL,
    campaign_goal TEXT NOT NULL,
    funding_target DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
  )
`);

await db.query(`
CREATE TABLE personalized_landings (
  id INT AUTO_INCREMENT PRIMARY KEY,

  token VARCHAR(255) UNIQUE NOT NULL,

  donor_email VARCHAR(255),

  personalized_email TEXT,

  suggested_color VARCHAR(7),

  style_name VARCHAR(255),

  option1 INT,
  option2 INT,
  option3 INT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`);
console.log("🚀 מסד הנתונים אותחל ועודכן בהצלחה מלאה!");
await db.end();