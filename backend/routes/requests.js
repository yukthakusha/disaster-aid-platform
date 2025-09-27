const express = require('express');
const router = express.Router();
const db = require('../db/connection'); // already a promise pool

// POST /api/requests — Create a resource request
router.post('/', async (req, res) => {
  const { name, phone, location, resource_type } = req.body;

  console.log("📥 New Request Received:", { name, phone, location, resource_type });

  if (!name || !phone || !location || !resource_type) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO resources_requestss (name, phone, location, resource_type) VALUES (?, ?, ?, ?)`,
      [name, phone, location, resource_type]
    );

    res.status(201).json({
      message: "Resource request created successfully",
      id: result.insertId
    });
  } catch (err) {
    console.error("❌ Error inserting resource request:", err);
    res.status(500).json({ error: "Failed to insert resource request" });
  }
});

// GET /api/requests — Fetch all requests
router.get('/', async (req, res) => {
  try {
    const [results] = await db.query(
      "SELECT * FROM resources_requestss ORDER BY timestamp DESC"
    );
    res.json(results);
  } catch (err) {
    console.error("❌ Error fetching resource requests:", err);
    res.status(500).json({ error: "Failed to fetch resource requests" });
  }
});

// PUT /api/requests/:id — Update request status
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await db.query(
      "UPDATE resources_requestss SET status = ? WHERE id = ?",
      [status, id]
    );
    res.json({ message: "Status updated successfully" });
  } catch (err) {
    console.error("❌ Error updating request:", err);
    res.status(500).json({ error: "Failed to update request" });
  }
});

module.exports = router;
