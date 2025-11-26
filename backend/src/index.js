require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { supabase } = require('./supabaseClient');

const authRoutes = require('./routes/auth');
const papersRoutes = require('./routes/papers');
const reviewsRoutes = require('./routes/reviews');
const adminRoutes = require('./routes/admin');
const notificationsRoutes = require('./routes/notifications');
const submissionsRoutes = require('./routes/submissions');
const issuesRoutes = require('./routes/issues');
const paymentsRoutes = require('./routes/payments');

const app = express();

// Basic config
const PORT = process.env.PORT || 4000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';

// Middleware
app.use(cors({
  origin: [FRONTEND_ORIGIN, 'http://localhost:5173'],
  credentials: true,
}));
app.use(express.json());
app.use(morgan('dev'));

// Simple health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    supabaseConfigured: Boolean(supabase),
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/papers', papersRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/submissions', submissionsRoutes);
app.use('/api/issues', issuesRoutes);
app.use('/api/payments', paymentsRoutes);

app.listen(PORT, () => {
  console.log(`Backend API listening on port ${PORT}`);
});
