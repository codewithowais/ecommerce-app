import { FastifyInstance } from 'fastify';

export async function registerGrowthRoutes(app: FastifyInstance) {
  app.get('/profit', {
    preHandler: app.authorize({ anyOf: ['growth.read'] })
  }, async () => {
    return { grossMargin: 0, orders: 0, lowMarginSkus: [] };
  });

  app.get('/reorder', {
    preHandler: app.authorize({ anyOf: ['growth.read'] })
  }, async () => {
    return { suggestions: [] };
  });

  app.post('/copilot', {
    preHandler: app.authorize({ anyOf: ['growth.write', 'catalog.write'] })
  }, async (request, reply) => {
    const { prompt } = request.body as { prompt: string };
    reply.send({ prompt, output: 'Generated description placeholder.' });
  });
}
