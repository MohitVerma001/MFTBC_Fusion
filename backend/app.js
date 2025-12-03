import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import blogRoutes from './src/routes/blog.routes.js';
import categoryRoutes from './src/routes/category.routes.js';
import tagRoutes from './src/routes/tag.routes.js';
import subspaceRoutes from './src/routes/subspace.routes.js';
import placeRoutes from './src/routes/place.routes.js';
import uploadRoutes from './src/routes/upload.routes.js';

import { errorHandler } from './src/middleware/error.middleware.js';
import logger from './src/utils/logger.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'FUSION Backend is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.use('/api/blogs', blogRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/subspaces', subspaceRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/upload', uploadRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.use(errorHandler);

export default app;
