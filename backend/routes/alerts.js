const express = require("express");
const router = express.Router();
const db = require("../db/connection");

// GET all alerts
router.get("/", (req, res) => {
  db.query("SELECT * FROM alerts ORDER BY timestamp DESC", (err, results) => {
    if (err) {
      console.error("Error fetching alerts:", err);
      return res.status(500).json({ error: "Failed to fetch alerts" });
    }
    res.json(results);
  });
});

// POST a new alert
router.post("/", (req, res) => {
  const { title, message } = req.body;
  if (!title || !message) {
    return res.status(400).json({ error: "Title and message are required" });
  }

  const sql = "INSERT INTO alerts (title, message) VALUES (?, ?)";
  db.query(sql, [title, message], (err, result) => {
    if (err) {
      console.error("Error inserting alert:", err);
      return res.status(500).json({ error: "Failed to insert alert" });
    }
    res.status(201).json({ id: result.insertId, title, message });
  });
});
// PUT /api/alerts/:id
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { title, message } = req.body;

  const sql = "UPDATE alerts SET title = ?, message = ? WHERE id = ?";
  db.query(sql, [title, message, id], (err, result) => {
    if (err) {
      console.error("Error updating alert:", err);
      return res.status(500).json({ error: "Failed to update alert" });
    }
    res.json({ message: "Alert updated successfully" });
  });
});
// DELETE an alert by ID
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    console.log(`🗑️ DELETE request received for alert ID: ${id}`); // add this

    db.query('DELETE FROM alerts WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error("❌ Error deleting alert:", err);
            return res.status(500).json({ error: 'Failed to delete alert' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Alert not found' });
        }

        res.json({ message: 'Alert deleted successfully' });
    });
});


module.exports = router;
