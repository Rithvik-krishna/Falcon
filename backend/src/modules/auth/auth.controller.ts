import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { authService } from './auth.service.js';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(2),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const refreshSchema = z.object({
  refreshToken: z.string(),
});

export async function registerHandler(request: FastifyRequest, reply: FastifyReply) {
  const result = registerSchema.safeParse(request.body);
  if (!result.success) {
    return reply.status(400).send({ error: 'Validation Error', details: result.error.format() });
  }

  try {
    const user = await authService.register(result.data.email, result.data.password, result.data.fullName);
    return reply.status(201).send({ success: true, data: user });
  } catch (err: any) {
    return reply.status(400).send({ error: err.message });
  }
}

export async function loginHandler(request: FastifyRequest, reply: FastifyReply) {
  const result = loginSchema.safeParse(request.body);
  if (!result.success) {
    return reply.status(400).send({ error: 'Validation Error', details: result.error.format() });
  }

  try {
    const authData = await authService.login(result.data.email, result.data.password);
    return reply.status(200).send({ success: true, data: authData });
  } catch (err: any) {
    return reply.status(401).send({ error: err.message });
  }
}

export async function refreshHandler(request: FastifyRequest, reply: FastifyReply) {
  const result = refreshSchema.safeParse(request.body);
  if (!result.success) {
    return reply.status(400).send({ error: 'Validation Error', details: result.error.format() });
  }

  try {
    const tokens = await authService.refresh(result.data.refreshToken);
    return reply.status(200).send({ success: true, data: tokens });
  } catch (err: any) {
    return reply.status(401).send({ error: err.message });
  }
}

export async function logoutHandler(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization;
  const accessToken = authHeader?.split(' ')[1] || '';
  const body = request.body as { refreshToken?: string } | undefined;

  await authService.logout(accessToken, body?.refreshToken);
  return reply.status(200).send({ success: true, message: 'Logged out successfully' });
}

export async function meHandler(request: FastifyRequest, reply: FastifyReply) {
  if (!request.user) {
    return reply.status(401).send({ error: 'Unauthorized' });
  }
  const profile = await authService.getProfile(request.user.id);
  return reply.status(200).send({ success: true, data: profile });
}
