require("dotenv").config();
const axios = require("axios");
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const sequelize = require("./models");
const ProjectModel = require("./models/Project")(sequelize);

const app = express();
const PORT = 5000;
const path = require("path");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const projectRoutes = require("./routes/projects");
app.use("/api/projects", projectRoutes);
app.use("/api/skills", require("./routes/skills"));
app.use("/api/education", require("./routes/education"));
app.use("/api/certifications", require("./routes/certifications"));
app.use("/api/experience", require("./routes/experience"));

app.use("/api/services", require("./routes/services"));
app.use("/api/testimonials", require("./routes/testimonials"));
app.use("/api/about", require("./routes/about"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  tls: {
    rejectUnauthorized: false,
  },
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: process.env.TO_EMAIL,
    subject: `New message from ${name}`,
    text: `
        You received a new message from your portfolio contact form:
  
        Name: ${name}
        Email: ${email}
        Message:
        ${message}
      `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info);
    res.json({ success: true, message: "Email sent." });
  } catch (err) {
    console.error("Error sending email:", err); // log the real error!
    res
      .status(500)
      .json({ error: "Failed to send email.", details: err.message });
  }
});



app.post('/api/visit', express.text({ type: '*/*' }), async (req, res) => {
  try {
    // Manually parse the JSON from the raw text body
    const { path, timeSpentMs, actions } = JSON.parse(req.body);

    // 1) Get IP & User-Agent
    const ip = req.headers['x-forwarded-for']?.split(',')[0] 
             || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

    // 2) Geolocate (as before)
    let geo = { country: 'Unknown', region: 'Unknown', city: 'Unknown' };
    try {
      const geoRes = await axios.get(`http://ip-api.com/json/${ip}`);
      if (geoRes.data?.status === 'success') {
        geo = {
          country: geoRes.data.country,
          region:  geoRes.data.regionName,
          city:    geoRes.data.city,
        };
      }
    } catch (e) {
      console.warn('Geo lookup failed', e);
    }

    // 3) Send notification email
    const html = `
      <h3>New Portfolio Visit</h3>
      <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      <p><strong>IP:</strong> ${ip}</p>
      <p><strong>Location:</strong> ${geo.city}, ${geo.region}, ${geo.country}</p>
      <p><strong>User-Agent:</strong> ${userAgent}</p>
      <p><strong>Path:</strong> ${path}</p>
      <p><strong>Time on Site:</strong> ${(timeSpentMs/1000).toFixed(1)} seconds</p>
      <p><strong>Actions:</strong> ${actions.join(', ') || 'None'}</p>
    `;
    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to:   process.env.TO_EMAIL,
      subject: '🔔 New Portfolio Visit',
      html
    });

    res.json({ status: 'ok' });
  } catch (err) {
    console.error('Visit logging error', err);
    res.status(500).json({ status: 'error' });
  }
});

app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

// Global error handler — catches any thrown error
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

app.get('/', (req, res) => {
  res.send('API is running...');
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});