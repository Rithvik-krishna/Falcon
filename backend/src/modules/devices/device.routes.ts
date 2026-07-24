import { FastifyInstance } from 'fastify';
import {
  registerDeviceHandler,
  listDevicesHandler,
  getDeviceHandler,
  updateDeviceHandler,
  deleteDeviceHandler,
  heartbeatHandler,
} from './device.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

export async function deviceRoutes(fastify: FastifyInstance) {
  fastify.post('/register', { preHandler: [authenticate] }, registerDeviceHandler);
  fastify.get('/', { preHandler: [authenticate] }, listDevicesHandler);
  fastify.get('/:id', { preHandler: [authenticate] }, getDeviceHandler);
  fastify.patch('/:id/settings', { preHandler: [authenticate] }, updateDeviceHandler);
  fastify.delete('/:id', { preHandler: [authenticate] }, deleteDeviceHandler);
  fastify.post('/:id/heartbeat', { preHandler: [authenticate] }, heartbeatHandler);
}
