const router = require('express').Router();
const Booking = require('../models/Booking');
const User = require('../models/User');
const Bike = require('../models/Bike');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);

router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('bikeId')
      .populate('userId', 'name email')
      .sort('-createdAt');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/bookings/:id/status', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/analytics', async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalBikes = await Bike.countDocuments();

    const revenue = await Booking.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);

    // Monthly revenue for chart (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlyRevenue = await Booking.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo }, status: { $ne: 'cancelled' } } },
      { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, revenue: { $sum: '$totalPrice' }, count: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Bookings by status
    const bookingsByStatus = await Booking.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Top bikes
    const topBikes = await Booking.aggregate([
      { $group: { _id: '$bikeId', count: { $sum: 1 }, revenue: { $sum: '$totalPrice' } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'bikes', localField: '_id', foreignField: '_id', as: 'bike' } },
      { $unwind: '$bike' },
    ]);

    const recentBookings = await Booking.find()
      .populate('bikeId')
      .populate('userId', 'name')
      .sort('-createdAt')
      .limit(5);

    res.json({
      totalBookings, totalUsers, totalBikes,
      totalRevenue: revenue[0]?.total || 0,
      monthlyRevenue, bookingsByStatus, topBikes, recentBookings,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// User management
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/users/:id/role', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
