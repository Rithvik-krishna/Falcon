import { redisClient } from '../config/redis.js';
import { logger } from '../utils/logger.js';

export interface DomainEvent<T = unknown> {
  eventId: string;
  eventType: string;
  timestamp: string;
  payload: T;
}

export class DomainEventBus {
  private static instance: DomainEventBus;
  private handlers: Map<string, ((event: DomainEvent) => Promise<void>)[]> = new Map();

  private constructor() {}

  public static getInstance(): DomainEventBus {
    if (!DomainEventBus.instance) {
      DomainEventBus.instance = new DomainEventBus();
    }
    return DomainEventBus.instance;
  }

  public subscribe(eventType: string, handler: (event: DomainEvent) => Promise<void>): void {
    const list = this.handlers.get(eventType) || [];
    list.push(handler);
    this.handlers.set(eventType, list);
  }

  public async publish<T>(eventType: string, payload: T): Promise<void> {
    const event: DomainEvent<T> = {
      eventId: crypto.randomUUID(),
      eventType,
      timestamp: new Date().toISOString(),
      payload,
    };

    logger.info({ eventType, eventId: event.eventId }, 'Publishing domain event');

    // 1. Publish to Redis PubSub for horizontal scaling
    await redisClient.publish(`domain-events:${eventType}`, JSON.stringify(event));

    // 2. Dispatch to local in-process handlers
    const list = this.handlers.get(eventType) || [];
    for (const handler of list) {
      try {
        await handler(event);
      } catch (err) {
        logger.error({ err, eventType, eventId: event.eventId }, 'Error executing domain event handler');
      }
    }
  }
}

export const domainEventBus = DomainEventBus.getInstance();
