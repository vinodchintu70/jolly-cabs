import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBiking, FaShieldAlt, FaClock, FaMapMarkerAlt, FaStar, FaArrowRight } from 'react-icons/fa';
import api from '../utils/api';
import BikeCard from '../components/BikeCard';
import Loader from '../components/Loader';

const stats = [
  { label: 'Happy Riders', value: '10,000+' },
  { label: 'Bikes Available', value: '500+' },
  { label: 'Cities', value: '25+' },
  { label: 'Years Experience', value: '8+' },
];

const features = [
  { icon: FaShieldAlt, title: 'Fully Insured', desc: 'All bikes come with comprehensive insurance coverage.' },
  { icon: FaClock, title: '24/7 Support', desc: 'Round the clock customer support for all your needs.' },
  { icon: FaMapMarkerAlt, title: 'Multiple Locations', desc: 'Pick up and drop at 25+ locations across the city.' },
  { icon: FaBiking, title: 'Premium Bikes', desc: 'Latest models maintained to the highest standards.' },
];

const testimonials = [
  { name: 'Rahul Sharma', rating: 5, text: 'Amazing experience! The bike was in perfect condition and the booking process was super smooth.', city: 'Mumbai' },
  { name: 'Priya Patel', rating: 5, text: 'Best bike rental service in the city. Affordable prices and great customer support!', city: 'Delhi' },
  { name: 'Arjun Singh', rating: 4, text: 'Loved the variety of bikes available. Will definitely book again for my next trip.', city: 'Bangalore' },
];

export default function Home() {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/bikes?limit=6').then(r => setBikes(r.data.slice(0, 6))).finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-slate-900 to-purple-900/30" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-indigo-400 mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /> Now available in 25+ cities
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
              Ride Your <span className="gradient-text">Dream Bike</span> Today
            </h1>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              Premium bike rentals at unbeatable prices. Choose from 500+ bikes and explore the city your way.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/bikes" className="btn-primary flex items-center gap-2">Explore Bikes <FaArrowRight /></Link>
              <Link to="/register" className="btn-outline">Get Started Free</Link>
            </div>
          </div>
          <div className="hidden md:flex justify-center">
            <div className="relative">
              <div className="w-80 h-80 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full flex items-center justify-center animate-float">
                <FaBiking className="text-indigo-400 text-9xl" />
              </div>
              <div className="absolute -top-4 -right-4 glass px-4 py-2 rounded-xl text-sm">
                <div className="text-green-400 font-bold">₹99/hr</div>
                <div className="text-slate-400 text-xs">Starting from</div>
              </div>
              <div className="absolute -bottom-4 -left-4 glass px-4 py-2 rounded-xl text-sm">
                <div className="text-yellow-400 font-bold flex items-center gap-1"><FaStar /> 4.9</div>
                <div className="text-slate-400 text-xs">10K+ Reviews</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-extrabold gradient-text">{s.value}</div>
              <div className="text-slate-400 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Why Choose <span className="gradient-text">Jolly Cabs?</span></h2>
          <p className="text-slate-400">Everything you need for the perfect ride</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className="card p-6 text-center group">
              <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-500/20 transition-colors">
                <f.icon className="text-indigo-400 text-2xl" />
              </div>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Bikes */}
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Featured <span className="gradient-text">Bikes</span></h2>
              <p className="text-slate-400">Top picks for your next adventure</p>
            </div>
            <Link to="/bikes" className="btn-outline hidden md:flex items-center gap-2">View All <FaArrowRight /></Link>
          </div>
          {loading ? <Loader /> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bikes.map(bike => <BikeCard key={bike._id} bike={bike} />)}
            </div>
          )}
          <div className="text-center mt-8 md:hidden">
            <Link to="/bikes" className="btn-primary">View All Bikes</Link>
          </div>
        </div>
      </section>

      {/* Offers Banner */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-yellow-300 font-semibold mb-2">🎉 Special Offer</div>
            <h2 className="text-3xl font-bold text-white mb-2">Get 20% Off Your First Ride!</h2>
            <p className="text-indigo-200">Use code <span className="font-bold text-white bg-white/20 px-2 py-1 rounded">JOLLY20</span> at checkout</p>
          </div>
          <Link to="/register" className="bg-white text-indigo-600 font-bold px-8 py-3 rounded-xl hover:bg-indigo-50 transition-colors whitespace-nowrap">
            Claim Offer
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">What Our <span className="gradient-text">Riders Say</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="card p-6">
                <div className="flex gap-1 mb-3">
                  {[...Array(t.rating)].map((_, j) => <FaStar key={j} className="text-yellow-400 text-sm" />)}
                </div>
                <p className="text-slate-300 text-sm mb-4 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">{t.name}</div>
                    <div className="text-slate-400 text-xs">{t.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
