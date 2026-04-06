import express from 'express';
import http from 'http';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { setupSocket } from './config/socket.js';
import { logger } from './utils/logger.js';

dotenv.config();

const app = express();
const httpServer = http.createServer(app);

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Security middleware
app.use(helmet());

// Middleware
app.use(express.json({ limit: '10kb' })); // Limit request payload
app.use(express.urlencoded({ limit: '10kb', extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  logger.debug(`${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API endpoints
app.get('/api/rooms', (req, res) => {
  if (NODE_ENV === 'development') {
    res.json({ message: 'Use Socket.IO for room operations' });
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler middleware
app.use((err, req, res, next) => {
  logger.error('Express error', err.message);
  res.status(err.statusCode || 500).json({
    error: NODE_ENV === 'development' ? err.message : 'Internal server error',
  });
});

// Setup Socket.IO
setupSocket(httpServer);

// Start server
httpServer.listen(PORT, () => {
  logger.info(
    `Server running on port ${PORT} in ${NODE_ENV} mode`,
    `http://localhost:${PORT}`
  );
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  httpServer.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});
