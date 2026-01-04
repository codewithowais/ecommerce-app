import { FastifyInstance } from 'fastify';
import { nanoid } from '../../utils/id.js';

interface CustomerPayload {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  tags?: string[];
}

interface AddressPayload {
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
  isDefault?: boolean;
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
    reply.send({
      id: request.params.id,
      email: 'customer@example.com',
      tags: ['vip'],
      addresses: [],
      segments: ['loyal'],
      notes: []
    });
  });

  app.post<{ Params: { id: string }; Body: AddressPayload }>(
    '/:id/addresses',
    { preHandler: app.authorize({ anyOf: ['customers.write'] }) },
    async (request, reply) => {
      reply.code(201).send({ id: nanoid(), customerId: request.params.id, ...request.body });
    }
  );

  app.get('/segments', {
    preHandler: app.authorize({ anyOf: ['customers.read'] })
  }, async () => {
    return { segments: [] };
  });

  app.get('/export', {
    preHandler: app.authorize({ anyOf: ['customers.read'] })
  }, async () => {
    return { url: 'https://example.com/exports/customers.csv' };
  });
}
