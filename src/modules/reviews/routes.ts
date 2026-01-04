import { FastifyInstance } from 'fastify';
import { nanoid } from '../../utils/id.js';

interface ReviewPayload {
  productId: string;
  rating: number;
  title?: string;
  body?: string;
  authorName?: string;
}

export async function registerReviewsRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    return { items: [], meta: { total: 0 } };
  });

  app.post<{ Body: ReviewPayload }>('/', async (request, reply) => {
    const id = nanoid();
    reply.code(201).send({ id, status: 'pending', ...request.body });
  });

  app.post<{ Params: { id: string }; Body: { action: 'approve' | 'reject' } }>(
    '/:id/moderate',
    {
      preHandler: app.authorize({ anyOf: ['reviews.moderate'] })
    },
    async (request, reply) => {
      const { id } = request.params;
      reply.send({ id, status: request.body.action === 'approve' ? 'published' : 'rejected' });
    }
  );
}
