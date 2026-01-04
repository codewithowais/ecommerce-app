import { FastifyInstance } from 'fastify';
import { nanoid } from '../../utils/id.js';

type OrderStatus = 'pending_payment' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

interface OrderPayload {
  customerId?: string;
  email: string;
  lineItems: Array<{ sku: string; quantity: number; price: number }>;
  shippingAddress: Record<string, string>;
  billingAddress?: Record<string, string>;
  notes?: string;
}

interface ShipmentPayload {
  carrier?: string;
  service?: string;
  trackingCode?: string;
  items?: Array<{ sku: string; quantity: number }>;
}

export async function registerOrdersRoutes(app: FastifyInstance) {
  app.get('/', {
    preHandler: app.authorize({ anyOf: ['orders.read'] })
  }, async () => {
    return { items: [], meta: { total: 0 } };
  });

  app.post<{ Body: OrderPayload }>('/', async (request, reply) => {
    const orderId = nanoid();
    reply.code(201).send({ id: orderId, status: 'pending_payment', ...request.body });
  });

  app.get<{ Params: { id: string } }>('/:id', {
    preHandler: app.authorize({ anyOf: ['orders.read'] })
  }, async (request, reply) => {
    reply.send({ id: request.params.id, status: 'processing', payments: [], shipments: [], timeline: [] });
  });

  app.post<{ Params: { id: string }; Body: { status: OrderStatus; note?: string } }>('/:id/status', {
    preHandler: app.authorize({ anyOf: ['orders.write'] })
  }, async (request, reply) => {
    const { id } = request.params;
    const { status, note } = request.body;
    reply.send({ id, status, note, updatedAt: new Date().toISOString() });
  });

  app.post<{ Params: { id: string }; Body: { amount: number; reason?: string } }>(
    '/:id/refund',
    {
      preHandler: app.authorize({ anyOf: ['orders.write', 'finance.write'] })
    },
    async (request, reply) => {
      const { id } = request.params;
      reply.code(201).send({ id: nanoid(), orderId: id, amount: request.body.amount, status: 'pending' });
    }
  );

  app.post<{ Params: { id: string }; Body: ShipmentPayload }>(
    '/:id/shipments',
    { preHandler: app.authorize({ anyOf: ['orders.write'] }) },
    async (request, reply) => {
      reply.code(201).send({ id: nanoid(), orderId: request.params.id, ...request.body, status: 'shipped' });
    }
  );

  app.get<{ Params: { id: string } }>('/:id/invoice', {
    preHandler: app.authorize({ anyOf: ['orders.read'] })
  }, async (request) => {
    return { orderId: request.params.id, url: 'https://example.com/invoices/demo.pdf' };
  });

  app.get<{ Params: { id: string } }>('/:id/timeline', {
    preHandler: app.authorize({ anyOf: ['orders.read'] })
  }, async (request) => {
    return { orderId: request.params.id, events: [] };
  });
}
