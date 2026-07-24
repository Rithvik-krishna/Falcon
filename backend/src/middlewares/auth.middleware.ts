import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import { config } from '../config/config.service.js';
import { redisClient } from '../config/redis.js';

export interface AuthenticatedUser {
  id: string;
  email: string;
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: AuthenticatedUser;
  }
}

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.status(401).send({ error: 'Unauthorized: Missing or invalid token format' });
    }

    const token = authHeader.split(' ')[1];

    // 1. Check if token is blacklisted in Redis
    const isBlacklisted = await redisClient.get(`token_blacklist:${token}`);
    if (isBlacklisted) {
      return reply.status(401).send({ error: 'Unauthorized: Token has been revoked' });
    }

    // 2. Verify JWT signature & expiration
    const decoded = jwt.verify(token, config.JWT_SECRET) as AuthenticatedUser;
    request.user = {
      id: decoded.id,
      email: decoded.email,
    };
  } catch (err) {
    return reply.status(401).send({ error: 'Unauthorized: Token verification failed' });
  }
}
