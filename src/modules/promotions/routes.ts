import { FastifyInstance } from 'fastify';
import { nanoid } from '../../utils/id.js';

interface PromotionPayload {
  code: string;
  type: 'percentage' | 'fixed' | 'free_shipping' | 'automatic';
  value?: number;
  minSpend?: number;
  usageLimit?: number;
  perCustomerLimit?: number;
  startsAt?: string;
  endsAt?: string;
}

export async function registerPromotionsRoutes(app: FastifyInstance) {
  app.get('/', {
    preHandler: app.authorize({ anyOf: ['promotions.read'] })
  }, async () => {
    return { items: [], meta: { total: 0 } };
  });

  app.post<{ Body: PromotionPayload }>('/', {
    preHandler: app.authorize({ anyOf: ['promotions.write'] })
  }, async (request, reply) => {
    const id = nanoid();
    reply.code(201).send({ id, ...request.body, status: 'active' });
  });

  app.post<{ Body: { code: string; cartTotal: number; customerId?: string } }>('/validate', async (request, reply) => {
    const { code } = request.body;
    reply.send({ code, valid: true, discount: 0 });
  });
}
