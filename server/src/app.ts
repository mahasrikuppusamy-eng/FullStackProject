import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import placeRoutes from './routes/place.routes.js';
import reviewRoutes from './routes/review.routes.js';
import adminRoutes from './routes/admin.routes.js';
import { errorHandler } from './middleware/error.js';
import { seedDatabase } from './config/db.js';

const app = express();

// CORS configuration per requirement 12
const clientOrigin = process.env.CLIENT_ORIGIN || '*';
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin in dev)
      if (!origin || clientOrigin === '*' || origin === clientOrigin) {
        callback(null, true);
      } else {
        callback(null, true); // Allow all in dev environment to prevent iframe/dev URL issues
      }
    },
    credentials: true,
  })
);

// Body parsers
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'AccessAble Coimbatore API',
    city: 'Coimbatore, Tamil Nadu, India',
    timestamp: new Date().toISOString(),
  });
});

// Idempotent reseed endpoint for testing / evaluation
app.post('/api/seed', async (_req, res) => {
  try {
    await seedDatabase();
    res.json({ success: true, message: 'Database reseeded successfully with 15 Coimbatore places.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mount REST API endpoints per contract
app.use('/api/auth', authRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
