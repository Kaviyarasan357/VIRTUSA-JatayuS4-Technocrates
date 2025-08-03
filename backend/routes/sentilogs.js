// backend/routes/sentilogs.js

const express = require('express');
const router = express.Router();
const SentimentLog = require('../models/SentimentLog');

// ✅ Get all logs
router.get('/', async (req, res) => {
    try {
        const logs = await SentimentLog.find().sort({ timestamp: -1 });
        res.json(logs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch logs' });
    }
});

// ✅ Get logs by parent email
router.get('/email/:email', async (req, res) => {
    try {
        const logs = await SentimentLog.find({ parentEmail: req.params.email }).sort({ timestamp: -1 });
        res.json(logs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch logs by email' });
    }
});

// ✅ Get logs by URL
router.get('/url', async (req, res) => {
    try {
        const url = req.query.url;
        if (!url) return res.status(400).json({ error: 'URL is required' });

        const logs = await SentimentLog.find({ url }).sort({ timestamp: -1 });
        res.json(logs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch logs by URL' });
    }
});



// 🔴 Negative logs (score < -0.2)
router.get('/negative', async (req, res) => {
  try {
    const logs = await SentimentLog.find({ score: { $lt: -0.2 } }).sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    console.error('❌ Error fetching negative logs:', err);
    res.status(500).json({ error: 'Failed to fetch negative logs' });
  }
});




module.exports = router;
