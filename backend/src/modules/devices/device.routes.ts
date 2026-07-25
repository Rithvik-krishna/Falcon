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
  // Real-time public fleet status for Mobile App & Web Dashboard
  fastify.get('/public-fleet', async (request, reply) => {
    // Dynamically simulate live real-time metric fluctuations
    const now = Date.now();
    const cpu1 = +(12 + Math.sin(now / 2000) * 8).toFixed(1);
    const ram1 = +(44 + Math.cos(now / 3000) * 4).toFixed(1);
    const rtt1 = Math.floor(10 + Math.random() * 4);

    const cpu2 = +(3.5 + Math.cos(now / 4000) * 2).toFixed(1);
    const ram2 = +(28 + Math.sin(now / 5000) * 3).toFixed(1);
    const rtt2 = Math.floor(16 + Math.random() * 5);

    const cpu3 = +(8.2 + Math.sin(now / 3000) * 3).toFixed(1);
    const ram3 = +(52 + Math.cos(now / 4000) * 5).toFixed(1);
    const rtt3 = Math.floor(7 + Math.random() * 3);

    return reply.send({
      success: true,
      timestamp: new Date().toISOString(),
      devices: [
        { 
          id: 'dev-001', 
          name: 'Primary Workstation (This PC)', 
          alias: 'rithvik-desktop-main', 
          os: 'Windows 11 Pro 64-bit', 
          ip: '192.168.1.104', 
          cpu: cpu1, 
          ram: ram1, 
          latency: rtt1, 
          isOnline: true,
          permanentId: '849 204 192',
          permanentPass: 'Falcon#Secure2026!'
        },
        { 
          id: 'dev-002', 
          name: 'Production Build Server', 
          alias: 'build-server-corp-02', 
          os: 'Windows Server 2022', 
          ip: '10.0.4.88', 
          cpu: cpu2, 
          ram: ram2, 
          latency: rtt2, 
          isOnline: true,
          permanentId: '912 384 501',
          permanentPass: 'Build#ServerPass99!'
        },
        { 
          id: 'dev-003', 
          name: 'Design Studio Mac', 
          alias: 'mac-studio-design', 
          os: 'macOS Sonoma 14.5', 
          ip: '192.168.1.150', 
          cpu: cpu3, 
          ram: ram3, 
          latency: rtt3, 
          isOnline: true,
          permanentId: '772 109 443',
          permanentPass: 'MacStudio#2026'
        },
      ]
    });
  });

  fastify.post('/register', { preHandler: [authenticate] }, registerDeviceHandler);
  fastify.get('/', { preHandler: [authenticate] }, listDevicesHandler);
  fastify.get('/:id', { preHandler: [authenticate] }, getDeviceHandler);
  fastify.patch('/:id/settings', { preHandler: [authenticate] }, updateDeviceHandler);
  fastify.delete('/:id', { preHandler: [authenticate] }, deleteDeviceHandler);
  fastify.post('/:id/heartbeat', { preHandler: [authenticate] }, heartbeatHandler);
}
