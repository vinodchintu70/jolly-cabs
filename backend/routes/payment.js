const router = require('express').Router();
const Booking = require('../models/Booking');
const { protect } = require('../middleware/auth');

router.post('/create-order', protect, async (req, res) => {
  try {
    res.json({ orderId: 'free_order_' + Date.now(), amount: req.body.amount * 100, currency: 'INR', key: 'test' });
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
