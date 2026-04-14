const router = require('express').Router();
const Review = require('../models/Review');
const Bike = require('../models/Bike');
const { protect } = require('../middleware/auth');

router.get('/:bikeId', async (req, res) => {
  try {
    const reviews = await Review.find({ bikeId: req.params.bikeId })
      .populate('userId', 'name')
      .sort('-createdAt');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/:bikeId', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const existing = await Review.findOne({ userId: req.user._id, bikeId: req.params.bikeId });
    if (existing) return res.status(400).json({ message: 'You already reviewed this bike' });

    const review = await Review.create({ userId: req.user._id, bikeId: req.params.bikeId, rating, comment });

    // Update bike average rating
    const reviews = await Review.find({ bikeId: req.params.bikeId });
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Bike.findByIdAndUpdate(req.params.bikeId, { rating: avg.toFixed(1), totalRatings: reviews.length });

    const populated = await review.populate('userId', 'name');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized' });
    await review.deleteOne();
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
