const express = require('express');
const Review = require('../models/Review');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product: productId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res
      .status(500)
      .json({ message: 'Error fetching reviews', error: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    if (!productId || !rating || !comment) {
      return res
        .status(400)
        .json({ message: 'productId, rating and comment are required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const review = await Review.create({
      product: productId,
      user: req.userId,
      rating,
      comment
    });

    const populated = await review.populate('user', 'name avatar');

    res.status(201).json(populated);
  } catch (err) {
    console.error('Error creating review:', err);
    res
      .status(500)
      .json({ message: 'Error creating review', error: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.user.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: 'You can only edit your own reviews' });
    }

    if (typeof rating === 'number') review.rating = rating;
    if (typeof comment === 'string') review.comment = comment;

    await review.save();
    const populated = await review.populate('user', 'name avatar');

    res.status(200).json(populated);
  } catch (err) {
    console.error('Error updating review:', err);
    res
      .status(500)
      .json({ message: 'Error updating review', error: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.user.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: 'You can only delete your own reviews' });
    }

    await review.deleteOne();

    res.status(200).json({ message: 'Review deleted' });
  } catch (err) {
    console.error('Error deleting review:', err);
    res
      .status(500)
      .json({ message: 'Error deleting review', error: err.message });
  }
});

module.exports = router;
