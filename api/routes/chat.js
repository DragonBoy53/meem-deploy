const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = 'gemini-2.5-flash';

async function callGeminiChat(messages, products) {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set in .env');
  }

  const productSummary = products.map((p) => ({
    id: p._id.toString(),
    name: p.name,
    category: p.category,
    price: p.price,
    imageUrl: p.imageUrl
  }));

  const historyText = (messages || [])
    .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
    .join('\n');

  const prompt = `
You are "Meem Style Assistant", an AI stylist for an online clothing store called Meem.

PRODUCT CATALOG (JSON):
${JSON.stringify(productSummary, null, 2)}

CONVERSATION SO FAR:
${historyText}

TASK:
1. Answer the user in a friendly way, suggesting what to wear for their occasion.
2. If you can, recommend 1–4 products from the catalog above. Only use IDs that exist in the catalog.

IMPORTANT: Your entire reply MUST be ONLY a JSON object, with no extra text and no markdown.
Format:

{
  "replyText": "your natural language answer here",
  "recommendedProductIds": ["<productId1>", "<productId2>"]
}
`;

  const body = {
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      temperature: 0.6,
      maxOutputTokens: 512
    }
  };

  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent` +
    `?key=${GEMINI_API_KEY}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('Gemini API error body:', text);
    throw new Error(`Gemini API error: ${res.status}`);
  }

  const data = await res.json();
  const textResponse =
    data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

  console.log('Gemini raw response (truncated):', textResponse.slice(0, 300));

  let json;
  try {
    json = JSON.parse(textResponse);
  } catch (err) {
    try {
      const cleaned = textResponse
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .trim();
      json = JSON.parse(cleaned);
    } catch (innerErr) {
      console.error('Failed to parse Gemini JSON. Raw text:', textResponse);
      throw new Error('Gemini returned invalid JSON');
    }
  }

  const replyText =
    typeof json.replyText === 'string'
      ? json.replyText
      : 'Here is an outfit idea based on your occasion.';

  const recommendedProductIds = Array.isArray(json.recommendedProductIds)
    ? json.recommendedProductIds.map((id) => String(id))
    : [];

  return { replyText, recommendedProductIds };
}

router.post('/', async (req, res) => {
  try {
    const { messages } = req.body || {};

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ message: 'messages array is required' });
    }

    const products = await Product.find().lean();
    if (!products || products.length === 0) {
      return res.status(200).json({
        replyText:
          'We do not have any products in the store yet, but I can still give general outfit advice.',
        recommendedProducts: []
      });
    }

    let replyText = '';
    let recommendedIds = [];

    try {
      const result = await callGeminiChat(messages, products);
      replyText = result.replyText;
      recommendedIds = result.recommendedProductIds || [];
    } catch (err) {
      console.error('Gemini chat error (falling back):', err.message);
      replyText =
        'Here is a general suggestion based on your occasion. I picked a few items from our collection that could work well together.';
      recommendedIds = [];
    }

    const idSet = new Set(recommendedIds.map((id) => String(id)));
    let recommendedProducts = products.filter((p) =>
      idSet.has(p._id.toString())
    );

    if (recommendedProducts.length === 0) {
      recommendedProducts = products.slice(0, 4);
    }

    recommendedProducts = recommendedProducts.slice(0, 4);

    return res.status(200).json({
      replyText,
      recommendedProducts
    });
  } catch (err) {
    console.error('Error in /api/chat route:', err);
    return res.status(500).json({
      message: 'Error talking to Meem Style Assistant',
      error: err.message
    });
  }
});

module.exports = router;
