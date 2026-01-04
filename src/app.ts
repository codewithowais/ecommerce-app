import Fastify, { FastifyInstance } from 'fastify';
import rateLimit from 'fastify-rate-limit';
import fastifyJwt from 'fastify-jwt';
import { registerHealthRoutes } from './routes/health.js';
import { registerAuthRoutes } from './modules/auth/routes.js';
import { registerCatalogRoutes } from './modules/catalog/routes.js';
import { registerInventoryRoutes } from './modules/inventory/routes.js';
import { registerGrowthRoutes } from './modules/growth/routes.js';
import { registerOrdersRoutes } from './modules/orders/routes.js';
import { registerCustomersRoutes } from './modules/customers/routes.js';
import { registerPromotionsRoutes } from './modules/promotions/routes.js';
import { registerReviewsRoutes } from './modules/reviews/routes.js';
import { registerContentRoutes } from './modules/content/routes.js';
import { registerReportsRoutes } from './modules/reports/routes.js';
import { registerStaffRoutes } from './modules/staff/routes.js';
import { requestContextPlugin } from './plugins/request-context.js';
import { rbacPlugin } from './plugins/rbac.js';

export function buildApp(): FastifyInstance {
  const app = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info'
    }
  });

  app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute'
  });

  app.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || 'dev-secret'
  });

  app.register(requestContextPlugin);
  app.register(rbacPlugin);

  app.register(registerHealthRoutes);
  app.register(registerAuthRoutes, { prefix: '/auth' });
  app.register(registerCatalogRoutes, { prefix: '/products' });
  app.register(registerInventoryRoutes, { prefix: '/inventory' });
  app.register(registerGrowthRoutes, { prefix: '/growth' });
  app.register(registerOrdersRoutes, { prefix: '/orders' });
  app.register(registerCustomersRoutes, { prefix: '/customers' });
  app.register(registerPromotionsRoutes, { prefix: '/promotions' });
  app.register(registerReviewsRoutes, { prefix: '/reviews' });
  app.register(registerContentRoutes, { prefix: '/content' });
  app.register(registerReportsRoutes, { prefix: '/reports' });
  app.register(registerStaffRoutes, { prefix: '/staff' });

  return app;
}
