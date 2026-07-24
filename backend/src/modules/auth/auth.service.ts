import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { hashPassword, verifyPassword } from '../../utils/crypto.js';
import { config } from '../../config/config.service.js';
import { redisClient } from '../../config/redis.js';
import { domainEventBus } from '../../services/domain-event.bus.js';

const prisma = new PrismaClient();

export class AuthService {
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async register(email: string, password: string, fullName: string) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new Error('User with this email already exists');
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        createdAt: true,
      },
    });

    await domainEventBus.publish('UserRegistered', { userId: user.id, email: user.email });
    return user;
  }

  public async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isValid = await verifyPassword(user.passwordHash, password);
    if (!isValid) {
      throw new Error('Invalid email or password');
    }

    // 1. Issue Access Token (15 mins)
    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      config.JWT_SECRET,
      { expiresIn: '15m' }
    );

    // 2. Issue Refresh Token (7 days)
    const rawRefreshToken = crypto.randomBytes(32).toString('hex');
    const refreshTokenHash = crypto.createHash('sha256').update(rawRefreshToken).digest('hex');

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: refreshTokenHash,
        expiresAt,
      },
    });

    await domainEventBus.publish('UserLoggedIn', { userId: user.id, email: user.email });

    return {
      accessToken,
      refreshToken: rawRefreshToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    };
  }

  public async refresh(rawRefreshToken: string) {
    const refreshTokenHash = crypto.createHash('sha256').update(rawRefreshToken).digest('hex');

    const tokenRecord = await prisma.refreshToken.findFirst({
      where: {
        tokenHash: refreshTokenHash,
        revoked: false,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });

    if (!tokenRecord) {
      throw new Error('Invalid or expired refresh token');
    }

    // Rotate refresh token: revoke current, issue new one
    await prisma.refreshToken.update({
      where: { id: tokenRecord.id },
      data: { revoked: true },
    });

    const newAccessToken = jwt.sign(
      { id: tokenRecord.user.id, email: tokenRecord.user.email },
      config.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const newRawRefreshToken = crypto.randomBytes(32).toString('hex');
    const newRefreshTokenHash = crypto.createHash('sha256').update(newRawRefreshToken).digest('hex');

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        userId: tokenRecord.user.id,
        tokenHash: newRefreshTokenHash,
        expiresAt,
      },
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRawRefreshToken,
    };
  }

  public async logout(accessToken: string, rawRefreshToken?: string) {
    // 1. Blacklist access token in Redis for remaining 15m window
    await redisClient.setex(`token_blacklist:${accessToken}`, 900, 'revoked');

    // 2. Revoke refresh token in database if provided
    if (rawRefreshToken) {
      const refreshTokenHash = crypto.createHash('sha256').update(rawRefreshToken).digest('hex');
      await prisma.refreshToken.updateMany({
        where: { tokenHash: refreshTokenHash },
        data: { revoked: true },
      });
    }
  }

  public async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        avatarUrl: true,
        status: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}

export const authService = AuthService.getInstance();
