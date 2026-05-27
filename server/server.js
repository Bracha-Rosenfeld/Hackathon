import express from "express";
import { db } from "../db/db.js";

const app = express();
app.use(express.json());

app.get("/", async (req, res) => {
  const [rows] = await db.query("SELECT NOW()");
  res.send(rows);
});

app.listen(3000, () => {
  console.log("server running");
});