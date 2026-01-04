import fp from 'fastify-plugin';
import { FastifyReply, FastifyRequest } from 'fastify';

export interface PermissionCheckOptions {
  anyOf?: string[];
  allOf?: string[];
}

declare module 'fastify' {
  interface FastifyInstance {
    authorize: (options: PermissionCheckOptions) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    authorizeOptional: () => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

export const rbacPlugin = fp(async (fastify) => {
  fastify.decorate('authorize', ({ anyOf, allOf }: PermissionCheckOptions) => {
    return async (request, reply) => {
      const permissions = request.context.permissions || [];

      if (anyOf && !anyOf.some((perm) => permissions.includes(perm))) {
        reply.code(403).send({ message: 'forbidden' });
        return;
      }

      if (allOf && !allOf.every((perm) => permissions.includes(perm))) {
        reply.code(403).send({ message: 'forbidden' });
        return;
      }
    };
  });

  fastify.decorate('authorizeOptional', () => {
    return async (_request, _reply) => {
      // Intentionally allows anonymous users; authentication/permission checks can be applied downstream.
    };
  });
});
