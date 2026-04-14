const mongoose = require('mongoose');
require('dotenv').config();

const Bike = require('./models/Bike');

const bikes = [
  {
    name: 'Royal Enfield Classic 350',
    brand: 'Royal Enfield',
    type: 'cruiser',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=800',
    ],
    pricePerHour: 150,
    pricePerDay: 999,
    availability: true,
    description: 'The iconic Royal Enfield Classic 350 - a timeless cruiser that combines retro styling with modern performance. Perfect for long rides and city commutes.',
    specs: {
      engine: '349cc Single Cylinder',
      mileage: '35 kmpl',
      power: '20.2 bhp',
      weight: '195 kg',
      fuelType: 'Petrol',
    },
    rating: 4.8,
    totalRatings: 124,
  },
  {
    name: 'KTM Duke 390',
    brand: 'KTM',
    type: 'sports',
    image: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800',
    images: [
      'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800',
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800',
    ],
    pricePerHour: 200,
    pricePerDay: 1299,
    availability: true,
    description: 'The KTM Duke 390 is a naked sports bike that delivers thrilling performance with its powerful engine and aggressive styling. Built for the adrenaline seekers.',
    specs: {
      engine: '373cc Single Cylinder',
      mileage: '25 kmpl',
      power: '43.5 bhp',
      weight: '163 kg',
      fuelType: 'Petrol',
    },
    rating: 4.7,
    totalRatings: 98,
  },
  {
    name: 'Honda Activa 6G',
    brand: 'Honda',
    type: 'scooter',
    image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800',
    images: [
      'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800',
    ],
    pricePerHour: 80,
    pricePerDay: 499,
    availability: true,
    description: 'The Honda Activa 6G is India\'s most trusted scooter. Ideal for city rides with its smooth performance, great mileage and comfortable seating.',
    specs: {
      engine: '109.51cc Single Cylinder',
      mileage: '60 kmpl',
      power: '7.68 bhp',
      weight: '107 kg',
      fuelType: 'Petrol',
    },
    rating: 4.6,
    totalRatings: 210,
  },
  {
    name: 'Bajaj Dominar 400',
    brand: 'Bajaj',
    type: 'cruiser',
    image: 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?w=800',
    images: [
      'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?w=800',
    ],
    pricePerHour: 180,
    pricePerDay: 1199,
    availability: true,
    description: 'The Bajaj Dominar 400 is a power cruiser that dominates every road. With its muscular design and powerful engine, it\'s perfect for long highway rides.',
    specs: {
      engine: '373.3cc Single Cylinder',
      mileage: '28 kmpl',
      power: '40 bhp',
      weight: '182 kg',
      fuelType: 'Petrol',
    },
    rating: 4.5,
    totalRatings: 87,
  },
  {
    name: 'Ather 450X',
    brand: 'Ather',
    type: 'electric',
    image: 'https://images.unsplash.com/photo-1593764592116-bfb2a97c642a?w=800',
    images: [
      'https://images.unsplash.com/photo-1593764592116-bfb2a97c642a?w=800',
    ],
    pricePerHour: 120,
    pricePerDay: 799,
    availability: true,
    description: 'The Ather 450X is India\'s smartest electric scooter. Zero emissions, instant torque and a connected experience make it the future of urban mobility.',
    specs: {
      engine: 'Electric Motor',
      mileage: '85 km/charge',
      power: '6.4 kW',
      weight: '108 kg',
      fuelType: 'Electric',
    },
    rating: 4.9,
    totalRatings: 156,
  },
  {
    name: 'Yamaha MT-15',
    brand: 'Yamaha',
    type: 'sports',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800',
    images: [
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800',
    ],
    pricePerHour: 160,
    pricePerDay: 1099,
    availability: true,
    description: 'The Yamaha MT-15 is a naked street fighter with aggressive styling and a rev-happy engine. It\'s the perfect bike for riders who love excitement.',
    specs: {
      engine: '155cc Single Cylinder',
      mileage: '45 kmpl',
      power: '18.4 bhp',
      weight: '138 kg',
      fuelType: 'Petrol',
    },
    rating: 4.7,
    totalRatings: 113,
  },
];

mongoose.connect(process.env.MONGO_URI, { family: 4 })
  .then(async () => {
    console.log('MongoDB Connected');
    await Bike.deleteMany({});
    await Bike.insertMany(bikes);
    console.log('✅ 6 Bikes added successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
  });
