const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB Database
connectDB();

const app = express();

// Standard Express Middlewares
app.use(cors({ origin: '*' })); // Enable CORS for all requests (frontend communication)
app.use(express.json()); // Body parser

// Simple Root Check Route
app.get('/', (req, res) => {
  res.json({ message: 'Personalized Healthcare & Nutritional Recommendation API is active.' });
});

// Route Registrations
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/health', require('./routes/healthRoutes'));
app.use('/api/nutrition', require('./routes/nutritionRoutes'));
app.use('/api/recommendations', require('./routes/recommendationRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

// Global 404 Route handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'API Endpoint not found' });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[Global Error]:', err.stack);
  res.status(500).json({
    success: false,
    message: 'An internal server error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`[Server] Core active on port: ${PORT}`);
  console.log(`[Env] Running in standard mode`);
  console.log(`=================================================`);
});
