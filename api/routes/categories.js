const express = require('express');
const Category = require('../models/Category');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories' });
  }
});

module.exports = router;
