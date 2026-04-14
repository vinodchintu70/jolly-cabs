const router = require('express').Router();
const Booking = require('../models/Booking');
const Bike = require('../models/Bike');
const { protect } = require('../middleware/auth');
const { sendBookingConfirmation } = require('../utils/email');

router.post('/', protect, async (req, res) => {
  try {
    const { bikeId, startDate, endDate, startTime, pickupLocation, dropLocation } = req.body;
    const bike = await Bike.findById(bikeId);
    if (!bike || !bike.availability) return res.status(400).json({ message: 'Bike not available' });

    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalHours = Math.ceil((end - start) / (1000 * 60 * 60));
    const totalPrice = totalHours >= 24
      ? Math.ceil(totalHours / 24) * bike.pricePerDay
      : totalHours * bike.pricePerHour;

    const booking = await Booking.create({
      userId: req.user._id, bikeId, startDate, endDate, startTime,
      pickupLocation, dropLocation, totalHours, totalPrice,
    });

    sendBookingConfirmation(req.user.email, booking, bike, req.user).catch(err => console.error('Email error:', err.message));
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/my', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id }).populate('bikeId').sort('-createdAt');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('bikeId').populate('userId', 'name email');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
