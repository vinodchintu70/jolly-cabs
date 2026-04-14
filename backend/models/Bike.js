const mongoose = require('mongoose');

const bikeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['scooter', 'sports', 'cruiser', 'electric', 'mountain'], required: true },
  brand: { type: String, required: true },
  image: { type: String, required: true },
  images: [String],
  pricePerHour: { type: Number, required: true },
  pricePerDay: { type: Number, required: true },
  availability: { type: Boolean, default: true },
  specs: {
    engine: String,
    mileage: String,
    power: String,
    weight: String,
    fuelType: String,
  },
  description: { type: String },
  rating: { type: Number, default: 4.5 },
  totalRatings: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Bike', bikeSchema);
