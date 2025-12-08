const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Product = require('../models/Product');

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/recommendations', async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'productId is required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
      You are a product recommendation assistant for an e-commerce clothing store.
      Based on this product:
      Name: ${product.name}
      Category: ${product.category}
      Description: ${product.description}
      
      Suggest 3-5 related clothing products or types that would go well with it.
      Respond in JSON array format, like:
      ["Denim Jacket", "White Sneakers", "Casual T-Shirt"]
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    let suggestions = [];
    try {
      suggestions = JSON.parse(text);
    } catch {
      suggestions = text
        .replace(/[\[\]]/g, '')
        .split(',')
        .map((x) => x.trim().replace(/['"]+/g, ''));
    }

    const regexQueries = suggestions.map((s) => new RegExp(s, 'i'));
    const matched = await Product.find({
      $or: [{ name: { $in: regexQueries } }, { category: { $in: regexQueries } }]
    }).limit(6);

    res.status(200).json({
      baseProduct: product.name,
      suggestions,
      recommendedProducts: matched
    });
  } catch (err) {
    console.error('AI recommendation error:', err);
    res.status(500).json({ message: 'AI recommendation failed', error: err.message });
  }
});

module.exports = router;
