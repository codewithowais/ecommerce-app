import { FastifyInstance } from 'fastify';

export async function registerWebhookRoutes(app: FastifyInstance) {
  app.post('/payments', async (request, reply) => {
    const signature = request.headers['x-signature'];
    const idempotencyKey = request.headers['idempotency-key'];
    const secret = process.env.PAYMENT_WEBHOOK_SECRET;

    if (!signature || !secret) {
      reply.code(400).send({ error: 'missing signature or secret' });
      return;
    }

    // In production, verify HMAC against raw payload + timestamp
    if (typeof signature !== 'string' || signature !== secret) {
      reply.code(401).send({ error: 'invalid signature' });
      return;
    }

    // Idempotency handling would persist the key+event id before processing
    if (!idempotencyKey) {
      reply.code(409).send({ error: 'missing idempotency-key' });
      return;
    }

    reply.code(202).send({ received: true, idempotencyKey });
  });
}
