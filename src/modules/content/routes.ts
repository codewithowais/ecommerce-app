import { FastifyInstance } from 'fastify';
import { nanoid } from '../../utils/id.js';

interface PagePayload {
  title: string;
  slug: string;
  body: string;
  published: boolean;
}

interface NavigationPayload {
  name: string;
  items: Array<{ label: string; href: string; target?: string }>;
}

export async function registerContentRoutes(app: FastifyInstance) {
  app.get('/pages', async () => {
    return { items: [], meta: { total: 0 } };
  });

  app.post<{ Body: PagePayload }>('/pages', {
    preHandler: app.authorize({ anyOf: ['content.write'] })
  }, async (request, reply) => {
    reply.code(201).send({ id: nanoid(), ...request.body });
  });

  app.get('/navigation', async () => {
    return { items: [] };
  });

  app.post<{ Body: NavigationPayload }>('/navigation', {
    preHandler: app.authorize({ anyOf: ['content.write'] })
  }, async (request, reply) => {
    reply.code(201).send({ id: nanoid(), ...request.body });
  });

  app.post<{ Body: { setting: string; value: unknown } }>('/theme', {
    preHandler: app.authorize({ anyOf: ['content.write'] })
  }, async (request, reply) => {
    reply.send({ updated: true, ...request.body });
  });
}
