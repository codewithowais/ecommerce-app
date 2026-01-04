import { FastifyInstance } from 'fastify';
import { nanoid } from '../../utils/id.js';

interface CustomerPayload {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  tags?: string[];
}

export async function registerCustomersRoutes(app: FastifyInstance) {
  app.get('/', {
    preHandler: app.authorize({ anyOf: ['customers.read'] })
  }, async () => {
    return { items: [], meta: { total: 0 } };
  });

  app.post<{ Body: CustomerPayload }>('/', {
    preHandler: app.authorize({ anyOf: ['customers.write'] })
  }, async (request, reply) => {
    const id = nanoid();
    reply.code(201).send({ id, ...request.body, createdAt: new Date().toISOString() });
  });

  app.get<{ Params: { id: string } }>('/:id', {
    preHandler: app.authorize({ anyOf: ['customers.read'] })
  }, async (request, reply) => {
    reply.send({ id: request.params.id, email: 'customer@example.com', tags: ['vip'], addresses: [] });
  });

  app.get('/segments', {
    preHandler: app.authorize({ anyOf: ['customers.read'] })
  }, async () => {
    return { segments: [] };
  });
}
