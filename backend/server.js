require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const { analyzeSentiment } = require('./sentiment');
const SentimentLog = require('./models/SentimentLog');
const SiteStats = require('./models/SiteStats');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));
app.use(express.json());

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

  const sentiLogsRoutes = require('./routes/sentilogs');
app.use('/api/logs', sentiLogsRoutes);

// ✅ Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendEmailAlert(toEmail, sentimentData) {
  const { title, url, sentiment, score, timestamp, visitCount, totalTimeSpentSeconds, totalTimeSpentMinutes, lastVisited } = sentimentData;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: '🛑 Alert: Concerning Sentiment Detected',
    html: `
      <h3>Silent Web Monitor Alert</h3>
      <p><strong>Title:</strong> ${title}</p>
      <p><strong>URL:</strong> <a href="${url}">${url}</a></p>
      <p><strong>Sentiment:</strong> ${sentiment}</p>
      <p><strong>Score:</strong> ${score}</p>
      <p><strong>Timestamp:</strong> ${new Date(timestamp).toLocaleString()}</p>

      <h4>📊 Site Statistics</h4>
      <p><strong>Visit Count:</strong> ${visitCount}</p>
      <p><strong>Total Time Spent (seconds):</strong> ${totalTimeSpentSeconds}</p>
      <p><strong>Total Time Spent (minutes):</strong> ${totalTimeSpentMinutes.toFixed(2)}</p>
      <p><strong>Last Visited:</strong> ${new Date(lastVisited).toLocaleString()}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent to:", toEmail);
  } catch (error) {
    console.error("❌ Email send error:", error);
  }
}


// ✅ User signup
app.post("/api/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashed });
    await user.save();

    res.json({ message: "User created" });
  } catch (err) {
    console.error("❌ Signup failed:", err);
    res.status(500).json({ message: "Signup failed" });
  }
});

// ✅ User login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ message: "Invalid password" });

    res.json({ message: "Login successful" });
  } catch (err) {
    console.error("❌ Login failed:", err);
    res.status(500).json({ message: "Login failed" });
  }
});

// ✅ Sentiment analysis GET
app.get('/analyze', async (req, res) => {
  const text = req.query.text;
  if (!text) return res.status(400).json({ error: 'Text query parameter is required.' });

  try {
    const result = await analyzeSentiment(text);
    if (!result || typeof result.score !== 'number') {
      return res.status(500).json({ error: 'Invalid sentiment result.' });
    }
    res.json({ sentiment: result.sentiment, score: result.score });
  } catch (err) {
    console.error('❌ Sentiment analysis failed:', err.message);
    res.status(500).json({ error: 'Sentiment analysis failed.' });
  }
});

// ✅ Sentiment analysis POST
app.post('/analyze', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required.' });

  try {
    const result = await analyzeSentiment(text);
    if (!result || typeof result.score !== 'number') {
      return res.status(500).json({ error: 'Invalid sentiment result.' });
    }
    res.json({ sentiment: result.sentiment, score: result.score });
  } catch (err) {
    console.error('❌ Sentiment analysis failed:', err.message);
    res.status(500).json({ error: 'Sentiment analysis failed.' });
  }
});

// ✅ /collect route updated to handle SiteStats fields
app.post('/collect', async (req, res) => {
  try {
    const { url, title, sentiment, score, timestamp, parentEmail, timeSpent } = req.body;

    if (!url || !title || !sentiment || typeof score !== 'number' || !parentEmail) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    const timeSpentSeconds = timeSpent ? parseInt(timeSpent) : 0;
    const timeSpentMinutes = timeSpentSeconds / 60;

    // Save to SentimentLog
    const entry = new SentimentLog({
      url,
      title,
      sentiment,
      score,
      timestamp: timestamp || Date.now(),
      parentEmail,
    });
    await entry.save();

    // Update or create SiteStats
    const siteStat = await SiteStats.findOne({ url, parentEmail });
    if (siteStat) {
      siteStat.visitCount += 1;
      siteStat.totalTimeSpentSeconds += timeSpentSeconds;
      siteStat.totalTimeSpentMinutes = siteStat.totalTimeSpentSeconds / 60;
      siteStat.lastVisited = Date.now();
      siteStat.sentiment = sentiment;
      siteStat.score = score;
      await siteStat.save();
    } else {
      const newStat = new SiteStats({
        url,
        title,
        visitCount: 1,
        totalTimeSpentSeconds: timeSpentSeconds,
        totalTimeSpentMinutes: timeSpentMinutes,
        lastVisited: Date.now(),
        sentiment,
        score,
        parentEmail,
      });
      await newStat.save();
    }

    console.log("📊 SiteStats updated for:", url);

    // Send alert if strongly negative
    if (score < -0.5) {
  // Fetch updated SiteStats for this alert
  const siteStatForEmail = await SiteStats.findOne({ url, parentEmail });

  await sendEmailAlert(parentEmail, {
    url,
    title,
    sentiment,
    score,
    timestamp: entry.timestamp,
    visitCount: siteStatForEmail.visitCount,
    totalTimeSpentSeconds: siteStatForEmail.totalTimeSpentSeconds,
    totalTimeSpentMinutes: siteStatForEmail.totalTimeSpentMinutes,
    lastVisited: siteStatForEmail.lastVisited
  });
}


    res.status(201).json({ message: 'Data stored successfully', data: entry });

  } catch (err) {
    console.error('❌ Failed to store data:', err);
    res.status(500).json({ error: 'Failed to store data' });
  }
});

// ✅ Get all SiteStats
app.get('/site-stats', async (req, res) => {
  try {
    const stats = await SiteStats.find({}).sort({ lastVisited: -1 });
    res.json(stats);
  } catch (err) {
    console.error("❌ Failed to fetch site stats:", err);
    res.status(500).json({ error: "Failed to fetch site stats" });
  }
});

// ✅ Negative logs route
app.get('/negative-logs', async (req, res) => {
  try {
    const logs = await SentimentLog.find({ score: { $lt: 0 } }).sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    console.error("❌ Failed to fetch negative logs:", err);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
});








// ✅ Delete negative logs
app.delete('/negative-logs', async (req, res) => {
  try {
    await SentimentLog.deleteMany({ score: { $lt: 0 } });
    res.json({ message: "Negative logs deleted" });
  } catch (err) {
    console.error("❌ Failed to delete logs:", err);
    res.status(500).json({ error: "Failed to delete negative logs" });
  }
});




// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
