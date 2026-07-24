import { FastifyInstance } from 'fastify';
import {
  registerHandler,
  loginHandler,
  refreshHandler,
  logoutHandler,
  meHandler,
} from './auth.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/register', registerHandler);
  fastify.post('/login', loginHandler);
  fastify.post('/refresh', refreshHandler);
  fastify.post('/logout', { preHandler: [authenticate] }, logoutHandler);
  fastify.get('/me', { preHandler: [authenticate] }, meHandler);
}
