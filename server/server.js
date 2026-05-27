import express from "express";
import { db } from "../db/db.js";

const app = express();
app.use(express.json());
import {
  getCompanyUsers,
  getUserById,
  createUser,
  updateUser,
} from "../controllers/usersController.js";

import {
  sendEmailsToCompanyUsers,
} from "../controllers/emailController.js";

app.get("/", async (req, res) => {
  const [rows] = await db.query("SELECT NOW()");
  res.send(rows);
});
// Get all users for a specific company
app.get(
  "/api/users/:companyId",
  getCompanyUsers
);

// Get single user by ID
app.get(
  "/api/users/:id",
  getUserById
);

// Create user
app.post(
  "/api/users",
  createUser
);

// Update user basic info
app.put(
  "/api/users/:id",
  updateUser  
);




// ======================================================
// EMAILS
// ======================================================

// Send personalized emails to all users
app.post(
  "/api/send-emails/:companyId",
  sendEmailsToCompanyUsers  
);

app.listen(3000, () => {
  console.log("server running");
});