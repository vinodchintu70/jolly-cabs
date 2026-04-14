const router = require('express').Router();
const Razorpay = require('razorpay');
const Booking = require('../models/Booking');
const { protect } = require('../middleware/auth');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post('/create-order', protect, async (req, res) => {
  try {
    const { amount } = req.body;
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: 'INR',
      receipt: 'jc_' + Date.now(),
    });
    res.json({ orderId: order.id, amount: order.amount, currency: order.currency, key: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/verify', protect, async (req, res) => {
  try {
    const { bookingId, paymentId } = req.body;
    await Booking.findByIdAndUpdate(bookingId, { paymentId, paymentStatus: 'paid', status: 'confirmed' });
    res.json({ message: 'Payment verified' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
