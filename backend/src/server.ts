import Fastify from 'fastify';
import { config } from './config/config.service.js';
import { logger } from './utils/logger.js';

const app = Fastify({
  logger: false, // We use custom pino logger instance
  disableRequestLogging: true,
});

// Register request logging middleware using Pino logger
app.addHook('onRequest', async (req) => {
  logger.info({ method: req.method, url: req.url, ip: req.ip }, 'Incoming Request');
});

// Health check endpoint
app.get('/health', async () => {
  return { status: 'healthy', timestamp: new Date().toISOString() };
});

// Register API v1 Prefix Router
app.register(async (v1) => {
  v1.get('/info', async () => {
    return {
      name: 'Falcon API',
      version: 'v1',
      environment: config.NODE_ENV,
    };
  });
}, { prefix: '/api/v1' });

async function startServer() {
  try {
    await app.listen({ port: config.PORT, host: config.HOST });
    logger.info({ port: config.PORT, host: config.HOST }, 'Falcon Backend Server running');
  } catch (err) {
    logger.error({ err }, 'Failed to start Fastify server');
    process.exit(1);
  }
}

startServer();
