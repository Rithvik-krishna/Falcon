import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { deviceService } from './device.service.js';

const registerDeviceSchema = z.object({
  deviceName: z.string().min(1),
  hostname: z.string().min(1),
  platform: z.string().min(1),
  architecture: z.string().min(1),
  osVersion: z.string().min(1),
  applicationVersion: z.string().min(1),
  publicKey: z.string().min(1),
});

const updateSettingsSchema = z.object({
  deviceName: z.string().min(1),
});

const heartbeatSchema = z.object({
  cpuUsage: z.number().min(0).max(100),
  ramUsage: z.number().min(0).max(100),
  diskUsage: z.number().min(0).max(100),
});

export async function registerDeviceHandler(request: FastifyRequest, reply: FastifyReply) {
  const result = registerDeviceSchema.safeParse(request.body);
  if (!result.success) {
    return reply.status(400).send({ error: 'Validation Error', details: result.error.format() });
  }

  const device = await deviceService.registerDevice({
    ...result.data,
    ownerId: request.user!.id,
  });
  return reply.status(201).send({ success: true, data: device });
}

export async function listDevicesHandler(request: FastifyRequest, reply: FastifyReply) {
  const devices = await deviceService.listUserDevices(request.user!.id);
  return reply.status(200).send({ success: true, data: devices });
}

export async function getDeviceHandler(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  try {
    const device = await deviceService.getDeviceById(id, request.user!.id);
    return reply.status(200).send({ success: true, data: device });
  } catch (err: any) {
    return reply.status(404).send({ error: err.message });
  }
}

export async function updateDeviceHandler(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  const result = updateSettingsSchema.safeParse(request.body);
  if (!result.success) {
    return reply.status(400).send({ error: 'Validation Error', details: result.error.format() });
  }

  try {
    const device = await deviceService.updateDeviceSettings(id, request.user!.id, result.data.deviceName);
    return reply.status(200).send({ success: true, data: device });
  } catch (err: any) {
    return reply.status(404).send({ error: err.message });
  }
}

export async function deleteDeviceHandler(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  try {
    await deviceService.deleteDevice(id, request.user!.id);
    return reply.status(200).send({ success: true, message: 'Device deleted' });
  } catch (err: any) {
    return reply.status(404).send({ error: err.message });
  }
}

export async function heartbeatHandler(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  const result = heartbeatSchema.safeParse(request.body);
  if (!result.success) {
    return reply.status(400).send({ error: 'Validation Error', details: result.error.format() });
  }

  await deviceService.recordHeartbeat(id, result.data.cpuUsage, result.data.ramUsage, result.data.diskUsage);
  return reply.status(200).send({ success: true, message: 'Heartbeat recorded' });
}
