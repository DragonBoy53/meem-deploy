// api/index.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load .env in local dev (Vercel uses its own env)
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// --- MongoDB connection ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected...');
  })
  .catch((err) => {
    console.error('Mongo connection error:', err);
  });

// --- Routes ---
const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const checkoutRoutes = require('./routes/checkout');
const ordersRoutes = require('./routes/orders');
const recommendationsRoutes = require('./routes/recommendations');

app.get('/api/health', (req, res) => {
  res.status(200).send('API is running!');
});

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/recommendations', recommendationsRoutes);

// ✅ Local dev: run a server
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}...`);
  });
}

// ✅ Vercel: export the Express app
module.exports = app;
