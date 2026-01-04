import { FastifyInstance } from 'fastify';

export async function registerReportsRoutes(app: FastifyInstance) {
  app.get('/sales', {
    preHandler: app.authorize({ anyOf: ['reports.read'] })
  }, async (request) => {
    const { range } = request.query as { range?: string };
    return { range: range || 'last_30_days', totals: { revenue: 0, orders: 0, units: 0 } };
  });

  app.get('/inventory', {
    preHandler: app.authorize({ anyOf: ['reports.read'] })
  }, async () => {
    return { lowStock: [], valuation: 0 };
  });

  app.get('/customers', {
    preHandler: app.authorize({ anyOf: ['reports.read'] })
  }, async () => {
    return { segments: [], ltvEstimates: [] };
  });
}
