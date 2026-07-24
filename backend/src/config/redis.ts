import { Redis } from 'ioredis';
import { config } from './config.service.js';
import { logger } from '../utils/logger.js';

export const redisClient = new Redis(config.REDIS_URL, {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    logger.warn({ times, delay }, 'Retrying Redis connection...');
    return delay;
  },
});

redisClient.on('connect', () => {
  logger.info('Connected to Redis');
});

redisClient.on('error', (err) => {
  logger.error({ err }, 'Redis connection error');
});
