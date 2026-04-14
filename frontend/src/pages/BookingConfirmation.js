import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaCheckCircle, FaBiking, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import api from '../utils/api';
import Loader from '../components/Loader';

export default function BookingConfirmation() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/bookings/${id}`).then(r => setBooking(r.data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="pt-24"><Loader /></div>;

  return (
    <div className="pt-24 min-h-screen flex items-center justify-center px-4">
      <div className="max-w-lg w-full card p-8 text-center">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaCheckCircle className="text-green-400 text-4xl" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h1>
        <p className="text-slate-400 mb-6">A confirmation email has been sent to your inbox.</p>

        <div className="bg-slate-900 rounded-xl p-5 text-left space-y-3 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Booking ID</span>
            <span className="text-indigo-400 font-bold">{booking?.bookingId}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400 flex items-center gap-1"><FaBiking /> Bike</span>
            <span className="text-white">{booking?.bikeId?.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400 flex items-center gap-1"><FaCalendarAlt /> Start</span>
            <span className="text-white">{new Date(booking?.startDate).toDateString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400 flex items-center gap-1"><FaCalendarAlt /> End</span>
            <span className="text-white">{new Date(booking?.endDate).toDateString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400 flex items-center gap-1"><FaMapMarkerAlt /> Pickup</span>
            <span className="text-white">{booking?.pickupLocation}</span>
          </div>
          <div className="flex justify-between text-sm font-bold border-t border-slate-700 pt-3">
            <span className="text-white">Total Paid</span>
            <span className="gradient-text text-lg">₹{booking?.totalPrice}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <Link to="/my-bookings" className="btn-outline flex-1 text-center">My Bookings</Link>
          <Link to="/bikes" className="btn-primary flex-1 text-center">Book Another</Link>
        </div>
      </div>
    </div>
  );
}
