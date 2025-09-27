const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// POST /api/requests — Create a resource request
router.post('/', (req, res) => {
  const { name, phone, location, resource_type } = req.body;

  console.log("📥 New Request Received:");
  console.log("Name:", name);
  console.log("Phone:", phone);
  console.log("Location:", location);

  if (!name || !phone || !location || !resource_type) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const sql = `INSERT INTO resources_requests(name, phone, location, resource_type) VALUES (?, ?, ?, ?)`;
  db.query(sql, [name, phone, location, resource_type], (err, result) => {
    if (err) {
      console.error("Error inserting resource request:", err);
      return res.status(500).json({ error: "Failed to insert resource request" });
    }
    res.status(201).json({ message: "Resource request created successfully", id: result.insertId });
  });
});

// GET /api/requests — Fetch all requests
router.get('/', (req, res) => {
  db.query("SELECT * FROM resource_requests ORDER BY timestamp DESC", (err, results) => {
    if (err) {
      console.error("Error fetching resource requests:", err);
      return res.status(500).json({ error: "Failed to fetch resource requests" });
    }
    res.json(results);
  });
});

// PUT /api/requests/:id — Update request status
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const sql = "UPDATE resource_requests SET status = ? WHERE id = ?";
  db.query(sql, [status, id], (err, result) => {
    if (err) {
      console.error("Error updating request:", err);
      return res.status(500).json({ error: "Failed to update request" });
    }
    res.json({ message: "Status updated successfully" });
  });
});

module.exports = router;
