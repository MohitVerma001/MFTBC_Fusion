import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import blogRoutes from './src/routes/blog.routes.js';
import categoryRoutes from './src/routes/category.routes.js';
import tagRoutes from './src/routes/tag.routes.js';
import placeRoutes from './src/routes/place.routes.js';
import subspaceRoutes from './src/routes/subspace.routes.js';
import uploadRoutes from './src/routes/upload.routes.js';
import spacesRoutes from './src/routes/spaces.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'FUSION Backend API is running',
    version: '1.0.0',
    endpoints: {
      blogs: '/api/blogs',
      categories: '/api/categories',
      tags: '/api/tags',
      places: '/api/places',
      subspaces: '/api/subspaces',
      upload: '/api/upload',
      spaces: '/api/spaces'
    }
  });
});

app.use('/api/blogs', blogRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/subspaces', subspaceRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/spaces', spacesRoutes);

app.use((err, req, res, next) => {
  console.error('Error:', err.stack);

  if (err.name === 'MulterError') {
    return res.status(400).json({
      success: false,
      message: 'File upload error',
      error: err.message
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

export default app;
