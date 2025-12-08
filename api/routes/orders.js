// api/routes/orders.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const PDFDocument = require('pdfkit');

router.get('/', async (req, res) => {
  try {
    const { status } = req.query;

    const filter = {};
    if (status) {
      filter.status = status;
    }

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    res.status(200).json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({
      message: 'Error fetching orders',
      error: err.message
    });
  }
});

// PATCH /api/orders/:id/status
// Body: { status: 'fulfilled' }
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!status) {
      return res.status(400).json({ message: 'Status is required.' });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).exec();

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    res.status(200).json(order);
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({
      message: 'Error updating order status',
      error: err.message
    });
  }
});

router.get('/by-session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    console.log('Looking up order for session:', sessionId);

    const order = await Order.findOne({ stripeSessionId: sessionId })
      .lean()
      .exec();

    console.log('Order found:', order?._id);

    if (!order) {
      return res
        .status(404)
        .json({ message: 'Order not found for this session ID.' });
    }

    res.status(200).json(order);
  } catch (err) {
    console.error('Error fetching order by session:', err);
    res.status(500).json({
      message: 'Error fetching order by session',
      error: err.message
    });
  }
});

// GET /api/orders/:id/receipt
// Generate a PDF receipt and stream it to the client
router.get('/:id/receipt', async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id).lean().exec();

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    // Set headers for file download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="meem-order-${order._id}.pdf"`
    );

    const doc = new PDFDocument({ margin: 50 });

    // Pipe PDF stream to response
    doc.pipe(res);

    // Header / title
    doc.fontSize(20).text('Meem - Order Receipt', { align: 'center' });
    doc.moveDown();

    // Basic info
    doc.fontSize(12);
    doc.text(`Order ID: ${order._id}`);
    if (order.createdAt) {
      doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`);
    }
    if (order.stripeSessionId) {
      doc.text(`Stripe Session ID: ${order.stripeSessionId}`);
    }
    doc.text(`Status: ${order.status || 'created'}`);
    doc.moveDown();

    // Address
    if (order.address) {
      doc.fontSize(14).text('Shipping Details', { underline: true });
      doc.fontSize(12);
      doc.text(`Name: ${order.address.fullName || ''}`);
      doc.text(`Phone: ${order.address.phone || ''}`);
      doc.text(`Street: ${order.address.street || ''}`);
      let cityLine = order.address.city || '';
      if (order.address.state) {
        cityLine += `, ${order.address.state}`;
      }
      doc.text(`City/State: ${cityLine}`);
      doc.text(`Postal Code: ${order.address.postalCode || ''}`);
      doc.text(`Country: ${order.address.country || ''}`);
      doc.moveDown();
    }

    // Items
    doc.fontSize(14).text('Items', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12);

    let calculatedTotal = 0;

    (order.items || []).forEach((item, index) => {
      const price = Number(item.price || 0);
      const qty = Number(item.quantity || 0);
      const lineTotal = price * qty;
      calculatedTotal += lineTotal;

      doc.text(
        `${index + 1}. ${item.name}  |  Qty: ${qty}  |  Price: $${price.toFixed(
          2
        )}  |  Line total: $${lineTotal.toFixed(2)}`
      );
    });

    doc.moveDown();

    doc.fontSize(14).text('Total', { underline: true });
    doc.fontSize(12);
    const total =
      typeof order.totalAmount === 'number'
        ? order.totalAmount
        : calculatedTotal;
    doc.text(`Order Total: $${Number(total).toFixed(2)}`);

    doc.moveDown(2);
    doc.fontSize(10).text(
      'Thank you for shopping with Meem. This is a test receipt generated in sandbox mode.',
      { align: 'center' }
    );

    // Finalize PDF
    doc.end();
  } catch (err) {
    console.error('Error generating order receipt PDF:', err);
    // If headers are already sent, we can't send JSON, but we log anyway
    if (!res.headersSent) {
      res.status(500).json({
        message: 'Error generating order receipt PDF',
        error: err.message
      });
    }
  }
});

module.exports = router;
