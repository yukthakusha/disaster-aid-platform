const express = require("express");
const router = express.Router();
const db = require("../db/connection");

// GET all alerts
router.get("/", async (req, res) => {
  try {
    const [results] = await db.execute("SELECT * FROM alerts ORDER BY timestamp DESC");
    res.json(results);
  } catch (err) {
    console.error("Error fetching alerts:", err);
    res.status(500).json({ error: "Failed to fetch alerts" });
  }
});

// POST a new alert
router.post("/", async (req, res) => {
  const { title, message } = req.body;
  if (!title || !message) {
    return res.status(400).json({ error: "Title and message are required" });
  }

  try {
    const [result] = await db.execute("INSERT INTO alerts (title, message) VALUES (?, ?)", [title, message]);
    res.status(201).json({ id: result.insertId, title, message });
  } catch (err) {
    console.error("Error inserting alert:", err);
    res.status(500).json({ error: "Failed to insert alert" });
  }
});

// PUT alert
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, message } = req.body;

  try {
    await db.execute("UPDATE alerts SET title = ?, message = ? WHERE id = ?", [title, message, id]);
    res.json({ message: "Alert updated successfully" });
  } catch (err) {
    console.error("Error updating alert:", err);
    res.status(500).json({ error: "Failed to update alert" });
  }
});

// DELETE alert
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute("DELETE FROM alerts WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    res.json({ message: 'Alert deleted successfully' });
  } catch (err) {
    console.error("Error deleting alert:", err);
    res.status(500).json({ error: "Failed to delete alert" });
  }
});

module.exports = router;
