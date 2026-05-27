import { db } from "../db/db.js";

// ======================================================
// GET ALL USERS OF COMPANY
// ======================================================

export async function getCompanyUsers(req, res) {
  try {
    const [rows] = await db.query(
      `SELECT u.*
       FROM users u
       JOIN user_companies uc ON u.id = uc.user_id
       JOIN companies c ON uc.company_id = c.id
       WHERE c.company_id = ?`,
      [req.params.companyId]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ======================================================
// GET USER BY ID
// ======================================================

export async function getUserById(req, res) {
  try {
    const [rows] = await db.query(
      "SELECT * FROM users WHERE id = ?",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ======================================================
// CREATE USER
// ======================================================

export async function createUser(req, res) {
  const {
    id,
    first_name,
    last_name,
    email,
    phone,
    city,
    job,
    status,
    age,
    company_id,
  } = req.body;

  try {
    await db.query(
      `INSERT INTO users
       (id, first_name, last_name, email, phone, city, job, status, age)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        first_name,
        last_name,
        email,
        phone,
        city || null,
        job || null,
        status || null,
        age || null,
      ]
    );

    const [[company]] = await db.query(
      "SELECT id FROM companies WHERE company_id = ?",
      [company_id]
    );

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    await db.query(
      `INSERT INTO user_companies
       (user_id, company_id)
       VALUES (?, ?)`,
      [id, company.id]
    );

    res.status(201).json({ message: "User added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ======================================================
// UPDATE USER
// ======================================================

export async function updateUser(req, res) {
  const {
    first_name,
    last_name,
    email,
    phone,
    city,
    job,
    status,
    age,
  } = req.body;

  try {
    await db.query(
      `UPDATE users
       SET first_name = ?,
           last_name = ?,
           email = ?,
           phone = ?,
           city = ?,
           job = ?,
           status = ?,
           age = ?
       WHERE id = ?`,
      [
        first_name,
        last_name,
        email,
        phone,
        city || null,
        job || null,
        status || null,
        age || null,
        req.params.id,
      ]
    );

    res.json({ message: "User updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}