import fp from 'fastify-plugin';
import { nanoid } from '../utils/id.js';

declare module 'fastify' {
  interface FastifyRequest {
    context: {
      requestId: string;
      userId?: string;
      role?: string;
      permissions?: string[];
    };
  }
}

export const requestContextPlugin = fp(async (fastify) => {
  fastify.addHook('onRequest', async (request) => {
    const requestId = request.id ? String(request.id) : nanoid();
    request.context = {
      requestId
    };

    const authHeader = request.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const token = authHeader.replace('Bearer ', '');
        const payload = fastify.jwt.decode(token) as { sub?: string; role?: string; permissions?: string[] } | null;
        if (payload) {
          request.context.userId = payload.sub;
          request.context.role = payload.role;
          request.context.permissions = payload.permissions || [];
        }
      } catch (err) {
        fastify.log.debug({ err, requestId }, 'failed to decode token');
      }
    }
  });
});
