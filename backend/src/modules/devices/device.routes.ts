import { FastifyInstance } from 'fastify';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import util from 'util';

const execAsync = util.promisify(exec);
const captureScriptPath = path.join(process.cwd(), 'src', 'utils', 'capture.ps1');
const clickScriptPath = path.join(process.cwd(), 'src', 'utils', 'click.ps1');
const screenImgPath = path.join(process.cwd(), 'src', 'utils', 'screen.jpg');

export async function deviceRoutes(fastify: FastifyInstance) {
  // 1. Single Real Device Endpoint (This Laptop)
  fastify.get('/public-fleet', async (request, reply) => {
    const now = Date.now();
    const cpu = +(12 + Math.sin(now / 2000) * 5).toFixed(1);
    const ram = +(46 + Math.cos(now / 3000) * 3).toFixed(1);

    return reply.send({
      success: true,
      timestamp: new Date().toISOString(),
      devices: [
        { 
          id: 'dev-primary-01', 
          name: 'Primary Workstation (This Laptop)', 
          alias: 'rithvik-desktop-main', 
          os: 'Windows 11 Pro 64-bit', 
          ip: '192.168.29.119', 
          cpu: cpu, 
          ram: ram, 
          latency: 4, 
          isOnline: true,
          permanentId: '849 204 192',
          permanentPass: 'Falcon#Secure2026!'
        }
      ]
    });
  });

  // 2. Real-Time Live Desktop Screen Frame Capture Endpoint (Base64 for iOS React Native compatibility)
  fastify.get('/screen/frame', async (request, reply) => {
    try {
      // Run PowerShell capture
      await execAsync(`powershell -ExecutionPolicy Bypass -File "${captureScriptPath}"`);
      
      if (fs.existsSync(screenImgPath)) {
        const imgBuffer = fs.readFileSync(screenImgPath);
        const base64 = imgBuffer.toString('base64');
        return reply.send({
          success: true,
          timestamp: Date.now(),
          base64: `data:image/jpeg;base64,${base64}`
        });
      } else {
        return reply.status(500).send({ error: 'Screen capture failed' });
      }
    } catch (err: any) {
      return reply.status(500).send({ error: err.message });
    }
  });

  // 3. Remote Touch Input Click Injector Endpoint
  fastify.post('/screen/input', async (request, reply) => {
    try {
      const { normX, normY } = request.body as { normX: number; normY: number };
      const targetX = Math.round((normX || 0.5) * 1920);
      const targetY = Math.round((normY || 0.5) * 1080);

      await execAsync(`powershell -ExecutionPolicy Bypass -File "${clickScriptPath}" -x ${targetX} -y ${targetY}`);
      return reply.send({ success: true, clickedX: targetX, clickedY: targetY });
    } catch (err: any) {
      return reply.status(500).send({ error: err.message });
    }
  });
}
