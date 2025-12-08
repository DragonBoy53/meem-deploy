const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: false
    },
    name: String,
    price: Number,
    quantity: Number,
    imageUrl: String
  },
  { _id: false }
);

const addressSchema = new mongoose.Schema(
  {
    fullName: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    items: [orderItemSchema],
    address: addressSchema,
    totalAmount: Number, 
    stripeSessionId: String,
    status: {
      type: String,
      default: 'created' 
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Order', orderSchema);
