import { FastifyInstance } from 'fastify';
import { nanoid } from '../../utils/id.js';

interface LoginBody {
  email: string;
  password: string;
}

export async function registerAuthRoutes(app: FastifyInstance) {
  app.post<{ Body: LoginBody }>('/login', async (request, reply) => {
    const { email } = request.body;

    // Stub: replace with real credential check + JWT issue
    const token = app.jwt.sign({ sub: nanoid(), email }, { expiresIn: '15m' });
    const refreshToken = app.jwt.sign({ sub: nanoid(), email }, { expiresIn: '7d' });

    reply.send({ token, refreshToken });
  });

  app.post('/refresh', async (request, reply) => {
    try {
      await request.jwtVerify();
      const user = request.user as { sub: string; email?: string };
      const token = app.jwt.sign({ sub: user.sub, email: user.email }, { expiresIn: '15m' });
      reply.send({ token });
    } catch (err) {
      reply.code(401).send({ message: 'invalid token' });
    }
  });
}
