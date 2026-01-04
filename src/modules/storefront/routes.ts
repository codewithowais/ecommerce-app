import { FastifyInstance } from 'fastify';
import { nanoid } from '../../utils/id.js';

interface CatalogQuery {
  search?: string;
  category?: string;
  collection?: string;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'bestsellers';
  page?: number;
  pageSize?: number;
}

interface WishlistItemBody {
  productId: string;
  variantId?: string;
}

interface CartItemBody {
  sku: string;
  quantity: number;
}

interface CheckoutBody {
  email: string;
  items: Array<CartItemBody & { price: number }>;
  shippingAddress: Record<string, string>;
  billingAddress?: Record<string, string>;
  paymentMethod: 'card' | 'cod' | 'bank_transfer';
  customerId?: string;
  notes?: string;
}

export async function registerStorefrontRoutes(app: FastifyInstance) {
  // Public catalog browse/search
  app.get('/catalog', async (request) => {
    const query = request.query as CatalogQuery;
    return {
      items: [],
      meta: { ...query, total: 0 }
    };
  });

  // Product detail with variants and reviews snapshot
  app.get<{ Params: { slug: string } }>('/catalog/:slug', async (request) => {
    return {
      slug: request.params.slug,
      title: 'Sample product',
      variants: [],
      reviews: { average: 0, count: 0 }
    };
  });

  // Collections listing
  app.get('/collections', async () => {
    return { items: [], meta: { total: 0 } };
  });

  // Wishlist endpoints (idempotent upsert/delete simulated)
  app.get('/wishlist', { preHandler: app.authorizeOptional?.() }, async () => {
    return { items: [] };
  });

  app.post<{ Body: WishlistItemBody }>('/wishlist', { preHandler: app.authorizeOptional?.() }, async (request, reply) => {
    const item = request.body;
    reply.code(201).send({ id: nanoid(), ...item });
  });

  app.delete<{ Body: WishlistItemBody }>('/wishlist', { preHandler: app.authorizeOptional?.() }, async (request, reply) => {
    reply.code(204).send();
  });

  // Cart estimation (no persistence in stub)
  app.post<{ Body: { items: CartItemBody[] } }>('/cart/estimate', async (request) => {
    const subtotal = request.body.items.reduce((acc, item) => acc + item.quantity * 10, 0);
    return { items: request.body.items, subtotal, shipping: 0, taxes: Math.round(subtotal * 0.1), total: subtotal }; // placeholder math
  });

  // Checkout stub
  app.post<{ Body: CheckoutBody }>('/checkout', async (request, reply) => {
    const orderId = nanoid();
    reply.code(201).send({ orderId, status: 'pending_payment', paymentIntentClientSecret: 'mock' });
  });

  // Order tracking
  app.get<{ Querystring: { reference: string } }>('/order-tracking', async (request) => {
    return { reference: request.query.reference, status: 'processing', timeline: [] };
  });
}
