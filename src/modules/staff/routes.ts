import { FastifyInstance } from 'fastify';
import { nanoid } from '../../utils/id.js';

interface RolePayload {
  name: string;
  permissions: string[];
}

interface StaffPayload {
  email: string;
  roleId?: string;
  name?: string;
  status?: 'active' | 'invited' | 'disabled';
}

export async function registerStaffRoutes(app: FastifyInstance) {
  app.get('/users', {
    preHandler: app.authorize({ anyOf: ['staff.read'] })
  }, async () => {
    return { items: [], meta: { total: 0 } };
  });

  app.post<{ Body: StaffPayload }>('/users', {
    preHandler: app.authorize({ anyOf: ['staff.write'] })
  }, async (request, reply) => {
    reply.code(201).send({ id: nanoid(), ...request.body });
  });

  app.get('/roles', {
    preHandler: app.authorize({ anyOf: ['staff.read'] })
  }, async () => {
    return { items: [] };
  });

  app.post<{ Body: RolePayload }>('/roles', {
    preHandler: app.authorize({ anyOf: ['staff.write'] })
  }, async (request, reply) => {
    reply.code(201).send({ id: nanoid(), ...request.body });
  });

  app.get('/audit', {
    preHandler: app.authorize({ anyOf: ['staff.read'] })
  }, async () => {
    return { entries: [] };
  });
}
