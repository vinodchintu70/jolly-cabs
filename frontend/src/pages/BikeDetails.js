import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaGasPump, FaTachometerAlt, FaWeight, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import api from '../utils/api';
import Loader from '../components/Loader';
import Reviews from '../components/Reviews';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function BikeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bike, setBike] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    api.get(`/bikes/${id}`)
      .then(r => setBike(r.data))
      .catch(() => toast.error('Bike not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBook = () => {
    if (!user) { toast.error('Please login to book'); navigate('/login'); return; }
    navigate(`/booking/${id}`);
  };

  if (loading) return <div className="pt-24"><Loader /></div>;
  if (!bike) return <div className="pt-24 text-center text-slate-400">Bike not found</div>;

  const images = bike.images?.length ? bike.images : [bike.image];

  return (
    <div className="pt-24 min-h-screen max-w-7xl mx-auto px-4 pb-12 page-enter">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors">
        <FaArrowLeft /> Back
      </button>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <div className="rounded-2xl overflow-hidden h-80 mb-3 relative">
            <img src={images[activeImg]} alt={bike.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${activeImg === i ? 'border-indigo-500' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="flex items-start justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-white">{bike.name}</h1>
              <p className="text-slate-400 capitalize">{bike.brand} · {bike.type}</p>
            </div>
            <span className={`badge ${bike.availability ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
              {bike.availability ? '✓ Available' : '✗ Unavailable'}
            </span>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={i < Math.floor(bike.rating) ? 'text-yellow-400' : 'text-slate-600'} />
              ))}
            </div>
            <span className="text-slate-400 text-sm">{bike.rating} ({bike.totalRatings} reviews)</span>
          </div>

          <p className="text-slate-300 mb-6 leading-relaxed">{bike.description}</p>

          {/* Specs */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { icon: FaGasPump, label: 'Mileage', val: bike.specs?.mileage },
              { icon: FaTachometerAlt, label: 'Power', val: bike.specs?.power },
              { icon: FaWeight, label: 'Weight', val: bike.specs?.weight },
              { icon: FaCheckCircle, label: 'Fuel', val: bike.specs?.fuelType },
            ].filter(s => s.val).map((s, i) => (
              <div key={i} className="glass rounded-xl p-3 flex items-center gap-3">
                <s.icon className="text-indigo-400" />
                <div>
                  <div className="text-xs text-slate-400">{s.label}</div>
                  <div className="text-white text-sm font-medium">{s.val}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing */}
          <div className="card p-5 mb-6">
            <h3 className="font-semibold text-white mb-3">Pricing</h3>
            <div className="flex gap-6">
              <div>
                <div className="text-2xl font-bold text-indigo-400">₹{bike.pricePerHour}</div>
                <div className="text-slate-400 text-sm">per hour</div>
              </div>
              <div className="border-l border-slate-700 pl-6">
                <div className="text-2xl font-bold text-purple-400">₹{bike.pricePerDay}</div>
                <div className="text-slate-400 text-sm">per day</div>
              </div>
            </div>
          </div>

          <button onClick={handleBook} disabled={!bike.availability}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${bike.availability ? 'btn-primary' : 'bg-slate-700 text-slate-400 cursor-not-allowed'}`}>
            {bike.availability ? '🏍️ Book This Bike' : 'Currently Unavailable'}
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <Reviews bikeId={id} />
    </div>
  );
}
