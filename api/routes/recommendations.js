
const express = require('express');
const axios = require('axios');
const Product = require('../models/Product');

const router = express.Router();

router.post('/chat', async (req, res) => {
  const { message } = req.body || {};
  const apiKey = process.env.GEMINI_API_KEY;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ message: 'Message is required.' });
  }

  let aiText = '';
  let matchedProducts = [];

  
  if (apiKey) {
    try {
      const prompt = `
You are a fashion stylist for an online clothing store.
User's question or occasion: "${message}"

1. Give a short, friendly outfit suggestion in 3–4 sentences.
2. Clearly mention what type of items (e.g. "slim-fit chinos", "casual t-shirt", "formal shirt") would be good.
3. Avoid talking about brands. Focus on style and occasion.
`;

      const url =
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' +
        apiKey;

      const geminiRes = await axios.post(url, {
        contents: [{ parts: [{ text: prompt }] }]
      });

      aiText =
        geminiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
        '';
    } catch (err) {
      console.error(
        'Gemini chat error (falling back):',
        err.response?.data || err.message
      );
    }
  } else {
    console.warn('GEMINI_API_KEY is not set; using fallback only.');
  }

  
  try {
    
    const tokens = message
      .split(/\s+/)
      .map((t) => t.trim())
      .filter(Boolean);

    if (tokens.length > 0) {
      const pattern = tokens.join('|'); 
      const regex = new RegExp(pattern, 'i');

      matchedProducts = await Product.find({
        $or: [
          { name: regex },
          { description: regex },
          { category: regex },
          { occasion: regex }
        ]
      })
        .limit(6)
        .lean()
        .exec();
    }
  } catch (err) {
    console.error('Error finding matching products:', err);
  }

  if (!aiText) {
    aiText =
      "Here's a general outfit suggestion based on your occasion. I've also tried to match a few products from our store that might fit your style.";
  }

  return res.status(200).json({
    message: aiText,
    products: matchedProducts || []
  });
});

module.exports = router;
