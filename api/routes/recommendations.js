const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { currentProductId, category } = req.body || {};

    const products = await Product.find().lean();
    if (!products || products.length === 0) {
      return res.status(200).json([]);
    }

    const normCategory = (category || '').toLowerCase();

    let candidates = products.filter((p) => {
      if (!p.category) return false;
      return normCategory && p.category.toLowerCase().includes(normCategory);
    });

    if (currentProductId) {
      candidates = candidates.filter(
        (p) => p._id.toString() !== currentProductId
      );
    }

    if (candidates.length === 0) {
      candidates = products.filter(
        (p) => !currentProductId || p._id.toString() !== currentProductId
      );
    }

    const limited = candidates.slice(0, 4);

    res.status(200).json(limited);
  } catch (err) {
    console.error('Error in /api/recommendations:', err);
    res.status(500).json({
      message: 'Error generating recommendations',
      error: err.message
    });
  }
});

module.exports = router;
