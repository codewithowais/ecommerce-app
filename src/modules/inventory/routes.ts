import { FastifyInstance } from 'fastify';

interface MovementPayload {
  delta: number;
  reason: 'receive' | 'adjustment' | 'sale' | 'refund' | 'reserve' | 'release';
  referenceType?: string;
  referenceId?: string;
  metadata?: Record<string, unknown>;
}

export async function registerInventoryRoutes(app: FastifyInstance) {
  app.get('/alerts', {
    preHandler: app.authorize({ anyOf: ['inventory.read'] })
  }, async () => {
    return { alerts: [] };
  });

  app.post<{ Params: { variantId: string }; Body: MovementPayload }>('/:variantId/movements', {
    preHandler: app.authorize({ anyOf: ['inventory.write'] })
  }, async (request, reply) => {
    const { variantId } = request.params;
    const { delta, reason, referenceId, referenceType, metadata } = request.body;

    // Append-only ledger write placeholder
    const movement = {
      id: `${variantId}-${Date.now()}`,
      variantId,
      delta,
      reason,
      referenceId,
      referenceType,
      metadata,
      createdAt: new Date().toISOString()
    };

    reply.code(201).send({ movement, onHand: 0, reserved: 0 });
  });
}
