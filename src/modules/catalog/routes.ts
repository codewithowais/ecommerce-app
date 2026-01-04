import { FastifyInstance } from 'fastify';
import { nanoid } from '../../utils/id.js';

interface ProductPayload {
  title: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  tags?: string[];
}

export async function registerCatalogRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    return { items: [], meta: { total: 0 } };
  });

  app.post<{ Body: ProductPayload }>('/', {
    preHandler: app.authorize({ anyOf: ['catalog.write'] })
  }, async (request, reply) => {
    const productId = nanoid();
    reply.code(201).send({ id: productId, ...request.body });
  });

  app.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    reply.send({ id, title: 'Sample product', variants: [], tags: [] });
  });
}
