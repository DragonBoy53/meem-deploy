const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

router.get('/search', async (req, res) => {
  try {
    const raw = (req.query.q || '').toString().trim();

    if (!raw) {
      return res.status(200).json([]);
    }

    const regex = new RegExp(raw, 'i'); 
    const products = await Product.find({
      $or: [{ name: regex }, { category: regex }, { description: regex }]
    }).sort({ createdAt: -1 });

    return res.status(200).json(products);
  } catch (err) {
    console.error('Error searching products:', err);
    return res.status(500).json({
      message: 'Error searching products',
      error: err.message
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.status(200).json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    return res.status(500).json({
      message: 'Error fetching products',
      error: err.message
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json(product);
  } catch (err) {
    console.error('Error fetching product:', err);
    return res.status(500).json({
      message: 'Error fetching product',
      error: err.message
    });
  }
});

module.exports = router;
