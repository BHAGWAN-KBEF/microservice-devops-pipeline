const request = require('supertest');
const { app, server } = require('../src/server');

describe('Orders API', () => {
  const validOrder = {
    customerId: 'customer-123',
    items: [
      {
        productId: 'product-1',
        quantity: 2,
        price: 29.99
      }
    ],
    shippingAddress: {
      street: '123 Main St',
      city: 'New York',
      zipCode: '10001',
      country: 'USA'
    }
  };

  afterAll(() => {
    server.close();
  });

  describe('Health Checks', () => {
    test('GET /health should return healthy status', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('healthy');
      expect(res.body).toHaveProperty('timestamp');
      expect(res.body).toHaveProperty('uptime');
    });

    test('GET /ready should return ready status', async () => {
      const res = await request(app).get('/ready');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ready');
    });
  });

  describe('Orders CRUD', () => {
    let orderId;

    test('POST /api/orders should create new order', async () => {
      const res = await request(app)
        .post('/api/orders')
        .send(validOrder);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.customerId).toBe(validOrder.customerId);
      expect(res.body.status).toBe('pending');
      expect(res.body.total).toBe(59.98);

      orderId = res.body.id;
    });

    test('GET /api/orders should return orders list', async () => {
      const res = await request(app).get('/api/orders');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('orders');
      expect(res.body).toHaveProperty('pagination');
      expect(Array.isArray(res.body.orders)).toBe(true);
    });

    test('GET /api/orders/:id should return specific order', async () => {
      const res = await request(app).get(`/api/orders/${orderId}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(orderId);
      expect(res.body.customerId).toBe(validOrder.customerId);
    });

    test('PUT /api/orders/:id/status should update order status', async () => {
      const res = await request(app)
        .put(`/api/orders/${orderId}/status`)
        .send({ status: 'processing' });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('processing');
      expect(res.body.id).toBe(orderId);
    });

    test('DELETE /api/orders/:id should delete order', async () => {
      const res = await request(app).delete(`/api/orders/${orderId}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Order deleted successfully');
    });
  });

  describe('Validation', () => {
    test('POST /api/orders should reject invalid order', async () => {
      const invalidOrder = {
        customerId: 'customer-123'
        // Missing required fields
      };

      const res = await request(app)
        .post('/api/orders')
        .send(invalidOrder);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation failed');
      expect(res.body.details).toBeDefined();
    });

    test('PUT /api/orders/:id/status should reject invalid status', async () => {
      const res = await request(app)
        .put('/api/orders/fake-id/status')
        .send({ status: 'invalid-status' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid status');
    });
  });

  describe('Filtering and Pagination', () => {
    beforeEach(async () => {
      // Create test orders with different statuses
      await request(app)
        .post('/api/orders')
        .send({ ...validOrder, customerId: 'customer-1' });

      const order2 = await request(app)
        .post('/api/orders')
        .send({ ...validOrder, customerId: 'customer-2' });

      // Update second order status
      await request(app)
        .put(`/api/orders/${order2.body.id}/status`)
        .send({ status: 'shipped' });
    });

    test('GET /api/orders should filter by status', async () => {
      const res = await request(app).get('/api/orders?status=shipped');

      expect(res.status).toBe(200);
      expect(res.body.orders).toHaveLength(1);
      expect(res.body.orders[0].status).toBe('shipped');
    });

    test('GET /api/orders should handle pagination', async () => {
      const res = await request(app).get('/api/orders?page=1&limit=1');

      expect(res.status).toBe(200);
      expect(res.body.orders).toHaveLength(1);
      expect(res.body.pagination.page).toBe(1);
      expect(res.body.pagination.limit).toBe(1);
    });
  });

  describe('Error Handling', () => {
    test('GET /api/orders/non-existent should return 404', async () => {
      const res = await request(app).get('/api/orders/non-existent-id');

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Order not found');
    });

    test('PUT /api/orders/non-existent/status should return 404', async () => {
      const res = await request(app)
        .put('/api/orders/non-existent/status')
        .send({ status: 'processing' });

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Order not found');
    });

    test('DELETE /api/orders/non-existent should return 404', async () => {
      const res = await request(app).delete('/api/orders/non-existent');

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Order not found');
    });

    test('POST /api/orders with empty items should trigger catch block', async () => {
      const invalidOrder = {
        customerId: 'customer-123',
        items: [],
        shippingAddress: validOrder.shippingAddress
      };

      const res = await request(app)
        .post('/api/orders')
        .send(invalidOrder);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation failed');
    });

    test('Unknown route should return 404', async () => {
      const res = await request(app).get('/unknown-route');

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Route not found');
    });
  });
});
