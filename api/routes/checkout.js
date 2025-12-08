
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');

router.post('/create-session', async (req, res) => {
  try {
    const { items, address } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty.' });
    }

    if (
      !address ||
      !address.fullName ||
      !address.phone ||
      !address.street ||
      !address.city
    ) {
      return res.status(400).json({
        message:
          'Missing required address fields (full name, phone, street, city).'
      });
    }

    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name || 'Item',
          images: item.imageUrl ? [item.imageUrl] : []
        },
        unit_amount: Math.round((item.price || 0) * 100)
      },
      quantity: item.quantity || 1
    }));

    const totalAmount = items.reduce(
      (sum, it) => sum + (it.price || 0) * (it.quantity || 1),
      0
    );

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      success_url: `${clientUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl}/checkout`
    });

    const order = await Order.create({
      items,
      address,
      totalAmount,
      stripeSessionId: session.id,
      status: 'created'
    });

    console.log('Order stored with id:', order._id.toString());
    console.log('Order stripeSessionId:', order.stripeSessionId);

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout session error:', err);
    return res.status(500).json({
      message: 'Unable to create Stripe Checkout session',
      error: err.message
    });
  }
});

router.get('/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent.latest_charge', 'invoice']
    });

    let receiptUrl = null;
    let invoicePdf = null;
    let hostedInvoiceUrl = null;

    if (
      session.payment_intent &&
      session.payment_intent.latest_charge &&
      session.payment_intent.latest_charge.receipt_url
    ) {
      receiptUrl = session.payment_intent.latest_charge.receipt_url;
    }


    if (session.invoice) {
      invoicePdf = session.invoice.invoice_pdf || null;
      hostedInvoiceUrl = session.invoice.hosted_invoice_url || null;
    }

    return res.status(200).json({
      receiptUrl,
      invoicePdf,
      hostedInvoiceUrl
    });
  } catch (err) {
    console.error('Error fetching Stripe session details:', err);
    return res.status(500).json({
      message: 'Error fetching Stripe session details',
      error: err.message
    });
  }
});

module.exports = router;
