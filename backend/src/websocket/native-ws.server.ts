import { Server as HTTPServer } from 'node:http';
import { WebSocketServer, WebSocket } from 'ws';
import jwt from 'jsonwebtoken';
import { config } from '../config/config.service.js';
import { logger } from '../utils/logger.js';
import { redisClient } from '../config/redis.js';

export interface AuthenticatedClient {
  ws: WebSocket;
  userId: string;
  deviceId?: string;
  clientType: 'mobile' | 'desktop';
}

export class NativeSignalingServer {
  private wss: WebSocketServer;
  private clients: Map<string, AuthenticatedClient> = new Map();

  constructor(server: HTTPServer) {
    this.wss = new WebSocketServer({ server, path: '/ws/signaling' });
    this.setupListeners();
  }

  private setupListeners() {
    this.wss.on('connection', async (ws: WebSocket, req) => {
      const urlParams = new URLSearchParams(req.url?.split('?')[1] || '');
      const token = urlParams.get('token') || '';
      const clientType = (urlParams.get('clientType') || 'mobile') as 'mobile' | 'desktop';
      const deviceId = urlParams.get('deviceId') || undefined;

      try {
        // Authenticate WebSocket connection via JWT
        const decoded = jwt.verify(token, config.JWT_SECRET) as { id: string; email: string };
        const clientId = deviceId || decoded.id;

        const client: AuthenticatedClient = {
          ws,
          userId: decoded.id,
          deviceId,
          clientType,
        };

        this.clients.set(clientId, client);
        logger.info({ clientId, clientType }, 'WebSocket client connected and authenticated');

        ws.on('message', (data: Buffer) => {
          this.handleMessage(clientId, data);
        });

        ws.on('close', () => {
          this.clients.delete(clientId);
          logger.info({ clientId }, 'WebSocket client disconnected');
        });

        ws.send(JSON.stringify({ type: 'authenticated', clientId }));
      } catch (err) {
        logger.warn('WebSocket authentication failed');
        ws.close(4001, 'Unauthorized');
      }
    });
  }

  private handleMessage(senderId: string, rawData: Buffer) {
    try {
      const message = JSON.parse(rawData.toString());
      const { targetId, type, payload } = message;

      logger.debug({ senderId, targetId, type }, 'Routing signaling message');

      const targetClient = this.clients.get(targetId);
      if (targetClient && targetClient.ws.readyState === WebSocket.OPEN) {
        targetClient.ws.send(JSON.stringify({
          senderId,
          type,
          payload,
        }));
      } else {
        // Forward message over Redis PubSub for multi-instance scaling
        redisClient.publish(`signaling:${targetId}`, JSON.stringify({
          senderId,
          type,
          payload,
        }));
      }
    } catch (err) {
      logger.error({ err }, 'Error handling WebSocket message');
    }
  }
}
