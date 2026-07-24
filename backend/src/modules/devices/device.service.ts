import { PrismaClient, DeviceStatus } from '@prisma/client';
import { domainEventBus } from '../../services/domain-event.bus.js';

const prisma = new PrismaClient();

export interface RegisterDeviceDTO {
  ownerId: string;
  deviceName: string;
  hostname: string;
  platform: string;
  architecture: string;
  osVersion: string;
  applicationVersion: string;
  publicKey: string;
}

export class DeviceService {
  private static instance: DeviceService;

  private constructor() {
    this.startHeartbeatMonitor();
  }

  public static getInstance(): DeviceService {
    if (!DeviceService.instance) {
      DeviceService.instance = new DeviceService();
    }
    return DeviceService.instance;
  }

  public async registerDevice(dto: RegisterDeviceDTO) {
    const device = await prisma.device.create({
      data: {
        ownerId: dto.ownerId,
        deviceName: dto.deviceName,
        hostname: dto.hostname,
        platform: dto.platform,
        architecture: dto.architecture,
        osVersion: dto.osVersion,
        applicationVersion: dto.applicationVersion,
        publicKey: dto.publicKey,
        status: DeviceStatus.ONLINE,
        lastSeen: new Date(),
      },
    });

    await domainEventBus.publish('DeviceRegistered', { deviceId: device.id, ownerId: device.ownerId });
    return device;
  }

  public async listUserDevices(userId: string) {
    return prisma.device.findMany({
      where: { ownerId: userId },
      orderBy: { lastSeen: 'desc' },
    });
  }

  public async getDeviceById(deviceId: string, userId: string) {
    const device = await prisma.device.findFirst({
      where: { id: deviceId, ownerId: userId },
    });

    if (!device) {
      throw new Error('Device not found');
    }
    return device;
  }

  public async updateDeviceSettings(deviceId: string, userId: string, deviceName: string) {
    const updated = await prisma.device.updateMany({
      where: { id: deviceId, ownerId: userId },
      data: { deviceName },
    });

    if (updated.count === 0) {
      throw new Error('Device not found');
    }
    return this.getDeviceById(deviceId, userId);
  }

  public async deleteDevice(deviceId: string, userId: string) {
    const deleted = await prisma.device.deleteMany({
      where: { id: deviceId, ownerId: userId },
    });

    if (deleted.count === 0) {
      throw new Error('Device not found');
    }
    await domainEventBus.publish('DeviceDeleted', { deviceId, userId });
  }

  public async recordHeartbeat(deviceId: string, cpuUsage: number, ramUsage: number, diskUsage: number) {
    const now = new Date();
    await prisma.device.update({
      where: { id: deviceId },
      data: {
        lastSeen: now,
        status: DeviceStatus.ONLINE,
      },
    });

    await prisma.deviceHeartbeat.create({
      data: {
        deviceId,
        cpuUsage,
        ramUsage,
        diskUsage,
        createdAt: now,
      },
    });
  }

  /**
   * Heartbeat monitor background evaluator running every 15s.
   * If a device has not sent a heartbeat for >30s, transition its status to OFFLINE.
   */
  private startHeartbeatMonitor() {
    setInterval(async () => {
      const threshold = new Date(Date.now() - 30_000); // 30 seconds ago
      const staleDevices = await prisma.device.findMany({
        where: {
          status: DeviceStatus.ONLINE,
          lastSeen: { lt: threshold },
        },
      });

      for (const dev of staleDevices) {
        await prisma.device.update({
          where: { id: dev.id },
          data: { status: DeviceStatus.OFFLINE },
        });
        await domainEventBus.publish('DeviceOffline', { deviceId: dev.id, ownerId: dev.ownerId });
      }
    }, 15_000);
  }
}

export const deviceService = DeviceService.getInstance();
