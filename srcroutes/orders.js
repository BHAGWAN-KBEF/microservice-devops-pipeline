const express = require('express');
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');
const logger = require('../srcutils/logger');

const router = express.Router();

// In-memory store (replace with database in production)
let orders = [];

// Validation schemas
const orderSchema = Joi.object({
  customerId: Joi.string().required(),
  items: Joi.array().items(
    Joi.object({
      productId: Joi.string().required(),
      quantity: Joi.number().integer().min(1).required(),
      price: Joi.number().positive().required()
    })
  ).min(1).required(),
  shippingAddress: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    zipCode: Joi.string().required(),
    country: Joi.string().required()
  }).required()
});

// GET /api/orders
router.get('/', (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  
  let filteredOrders = orders;
  if (status) {
    filteredOrders = orders.filter(order => order.status === status);
  }
  
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);
  
  res.json({
    orders: paginatedOrders,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: filteredOrders.length,
      pages: Math.ceil(filteredOrders.length / limit)
    }
  });
});

// GET /api/orders/:id
router.get('/:id', (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  
  res.json(order);
});

// POST /api/orders
router.post('/', async (req, res) => {
  try {
    const { error, value } = orderSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details.map(d => d.message)
      });
    }
    
    const order = {
      id: uuidv4(),
      ...value,
      status: 'pending',
      total: value.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    orders.push(order);
    logger.info('Order created', { orderId: order.id, customerId: order.customerId });
    
    res.status(201).json(order);
  } catch (err) {
    logger.error('Error creating order', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// PUT /api/orders/:id/status
router.put('/:id/status', (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      error: 'Invalid status',
      validStatuses
    });
  }
  
  const orderIndex = orders.findIndex(o => o.id === req.params.id);
  
  if (orderIndex === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }
  
  orders[orderIndex].status = status;
  orders[orderIndex].updatedAt = new Date().toISOString();
  
  logger.info('Order status updated', { 
    orderId: req.params.id, 
    newStatus: status 
  });
  
  res.json(orders[orderIndex]);
});

// DELETE /api/orders/:id
router.delete('/:id', (req, res) => {
  const orderIndex = orders.findIndex(o => o.id === req.params.id);
  
  if (orderIndex === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }
  
  const deletedOrder = orders.splice(orderIndex, 1)[0];
  logger.info('Order deleted', { orderId: req.params.id });
  
  res.json({ message: 'Order deleted successfully', order: deletedOrder });
});

module.exports = router;