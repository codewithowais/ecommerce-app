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

interface CategoryPayload {
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
}

interface CollectionPayload {
  title: string;
  handle: string;
  type: 'manual' | 'rule_based';
  rules?: Record<string, unknown>;
}

export async function registerCatalogRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    return { items: [], meta: { total: 0 } };
  });

  app.post<{ Body: ProductPayload }>('/', {
    preHandler: app.authorize({ anyOf: ['catalog.write'] })
  }, async (request, reply) => {
    const productId = nanoid();
    reply.code(201).send({ id: productId, ...request.body, variants: [], status: 'draft' });
  });

  app.get('/categories/tree', async () => {
    return { items: [], meta: { total: 0 } };
  });

  app.post<{ Body: CategoryPayload }>('/categories', {
    preHandler: app.authorize({ anyOf: ['catalog.write'] })
  }, async (request, reply) => {
    reply.code(201).send({ id: nanoid(), ...request.body });
  });

  app.get('/collections', async () => {
    return { items: [], meta: { total: 0 } };
  });

  app.post<{ Body: CollectionPayload }>('/collections', {
    preHandler: app.authorize({ anyOf: ['catalog.write'] })
  }, async (request, reply) => {
    reply.code(201).send({ id: nanoid(), ...request.body, rules: request.body.rules || {} });
  });

  app.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    reply.send({ id, title: 'Sample product', variants: [], tags: [], categories: [], collections: [] });
  });
}
