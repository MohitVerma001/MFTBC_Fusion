import app from './app.js';
import logger from './src/utils/logger.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  logger.success(`FUSION Backend Server is running`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`Server URL: http://${HOST}:${PORT}`);
  logger.info(`Health Check: http://${HOST}:${PORT}/health`);
  logger.info(`API Base URL: http://${HOST}:${PORT}/api`);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise);
  logger.error('Reason:', reason);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

export default server;
