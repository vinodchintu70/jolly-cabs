import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBiking, FaCalendarAlt } from 'react-icons/fa';
import api from '../utils/api';
import Loader from '../components/Loader';

const statusColors = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  confirmed: 'bg-green-500/20 text-green-400',
  cancelled: 'bg-red-500/20 text-red-400',
  completed: 'bg-blue-500/20 text-blue-400',
};

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/bookings/my').then(r => setBookings(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="pt-24"><Loader /></div>;

  return (
    <div className="pt-24 min-h-screen max-w-4xl mx-auto px-4 pb-12">
      <h1 className="text-3xl font-bold text-white mb-2">My <span className="gradient-text">Bookings</span></h1>
      <p className="text-slate-400 mb-8">Track all your bike rentals</p>

      {bookings.length === 0 ? (
        <div className="text-center py-20">
          <FaBiking className="text-5xl text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 mb-4">No bookings yet</p>
          <Link to="/bikes" className="btn-primary">Book a Bike</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map(b => (
            <div key={b._id} className="card p-5 flex flex-col md:flex-row gap-4 items-start md:items-center">
              <img src={b.bikeId?.image} alt={b.bikeId?.name} className="w-24 h-16 rounded-xl object-cover" />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-white">{b.bikeId?.name}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[b.status]}`}>{b.status}</span>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                  <span className="flex items-center gap-1"><FaCalendarAlt /> {new Date(b.startDate).toDateString()}</span>
                  <span>→ {new Date(b.endDate).toDateString()}</span>
                  <span className="text-indigo-400 font-medium">₹{b.totalPrice}</span>
                </div>
                <div className="text-xs text-slate-500 mt-1">ID: {b.bookingId}</div>
              </div>
              <Link to={`/booking-confirmation/${b._id}`} className="btn-outline py-2 px-4 text-sm">View Details</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
