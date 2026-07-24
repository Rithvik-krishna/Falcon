import Fastify from 'fastify';
import { config } from './config/config.service.js';
import { logger } from './utils/logger.js';
import { authRoutes } from './modules/auth/auth.routes.js';
import { deviceRoutes } from './modules/devices/device.routes.js';
import { featureFlagService } from './services/feature-flag.service.js';
import { NativeSignalingServer } from './websocket/native-ws.server.js';
import { authenticate } from './middlewares/auth.middleware.js';

const app = Fastify({
  logger: false,
  disableRequestLogging: true,
});

app.addHook('onRequest', async (req) => {
  logger.info({ method: req.method, url: req.url, ip: req.ip }, 'Incoming Request');
});

// Health check endpoint
app.get('/health', async () => {
  return { status: 'healthy', timestamp: new Date().toISOString() };
});

// Register API v1 Routes
app.register(async (v1) => {
  v1.get('/info', async () => {
    return {
      name: 'Falcon API',
      version: 'v1',
      environment: config.NODE_ENV,
    };
  });

  v1.get('/features', { preHandler: [authenticate] }, async (req) => {
    const flags = featureFlagService.getFlagsForUser(req.user!.id);
    return { success: true, data: flags };
  });

  v1.register(authRoutes, { prefix: '/auth' });
  v1.register(deviceRoutes, { prefix: '/devices' });
}, { prefix: '/api/v1' });

async function startServer() {
  try {
    await app.listen({ port: config.PORT, host: config.HOST });
    
    // Attach Native WebSocket Signaling Server to HTTP server
    new NativeSignalingServer(app.server);

    logger.info({ port: config.PORT, host: config.HOST }, 'Falcon Backend Server & WebSocket Signaling running');
  } catch (err) {
    logger.error({ err }, 'Failed to start Fastify server');
    process.exit(1);
  }
}

startServer();
