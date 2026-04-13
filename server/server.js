const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/beneficiaries', require('./routes/beneficiaryRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/documents', require('./routes/documentRoutes'));
app.use('/api/grants', require('./routes/grantRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/fraud', require('./routes/fraudRoutes'));
app.use('/api/chatbot', require('./routes/chatbotRoutes'));
app.use('/api/staff', require('./routes/staffRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`\n🚀 GIA HUB API running on http://localhost:${PORT}\n`);
});
