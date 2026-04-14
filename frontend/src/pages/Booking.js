import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaArrowLeft } from 'react-icons/fa';
import api from '../utils/api';
import Loader from '../components/Loader';
import CouponInput from '../components/CouponInput';
import toast from 'react-hot-toast';

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bike, setBike] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [coupon, setCoupon] = useState(null);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    startDate: '', endDate: '', startTime: '09:00',
    pickupLocation: '', dropLocation: '',
  });

  useEffect(() => {
    api.get(`/bikes/${id}`).then(r => setBike(r.data)).finally(() => setLoading(false));
  }, [id]);

  const totalHours = form.startDate && form.endDate
    ? Math.max(0, Math.ceil((new Date(form.endDate) - new Date(form.startDate)) / (1000 * 60 * 60)))
    : 0;

  const basePrice = bike ? (totalHours >= 24
    ? Math.ceil(totalHours / 24) * bike.pricePerDay
    : totalHours * bike.pricePerHour) : 0;

  const discount = coupon ? Math.round(basePrice * coupon.discountPercent / 100) : 0;
  const totalPrice = basePrice - discount;

  const validate = () => {
    const errs = {};
    if (!form.startDate) errs.startDate = 'Start date is required';
    if (!form.endDate) errs.endDate = 'End date is required';
    if (form.startDate && form.endDate && new Date(form.endDate) <= new Date(form.startDate))
      errs.endDate = 'End date must be after start date';
    if (!form.pickupLocation.trim()) errs.pickupLocation = 'Pickup location is required';
    if (!form.dropLocation.trim()) errs.dropLocation = 'Drop location is required';
    return errs;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleBooking = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      const { data: booking } = await api.post('/bookings', {
        bikeId: id, ...form,
        couponCode: coupon?.code,
        discountAmount: discount,
      });
      toast.success('Booking confirmed! 🎉');
      navigate(`/booking-confirmation/${booking._id}`, { state: { booking } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="pt-24"><Loader /></div>;
  if (!bike) return <div className="pt-24 text-center text-slate-400">Bike not found</div>;

  return (
    <div className="pt-24 min-h-screen max-w-4xl mx-auto px-4 pb-12 page-enter">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors">
        <FaArrowLeft /> Back
      </button>
      <h1 className="text-3xl font-bold text-white mb-2">Book <span className="gradient-text">{bike?.name}</span></h1>
      <p className="text-slate-400 mb-8">Fill in the details to complete your booking</p>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-5">
          {/* Dates */}
          <div className="card p-6">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><FaCalendarAlt className="text-indigo-400" /> Select Dates</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Start Date</label>
                <input type="date" name="startDate" value={form.startDate} onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`input ${errors.startDate ? 'input-error' : ''}`} />
                {errors.startDate && <p className="text-red-400 text-xs mt-1">⚠ {errors.startDate}</p>}
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block">End Date</label>
                <input type="date" name="endDate" value={form.endDate} onChange={handleChange}
                  min={form.startDate || new Date().toISOString().split('T')[0]}
                  className={`input ${errors.endDate ? 'input-error' : ''}`} />
                {errors.endDate && <p className="text-red-400 text-xs mt-1">⚠ {errors.endDate}</p>}
              </div>
            </div>
          </div>

          {/* Time */}
          <div className="card p-6">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><FaClock className="text-indigo-400" /> Pickup Time</h3>
            <input type="time" name="startTime" value={form.startTime} onChange={handleChange} className="input" />
          </div>

          {/* Locations */}
          <div className="card p-6">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><FaMapMarkerAlt className="text-indigo-400" /> Locations</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Pickup Location</label>
                <input name="pickupLocation" value={form.pickupLocation} onChange={handleChange}
                  placeholder="Enter pickup address"
                  className={`input ${errors.pickupLocation ? 'input-error' : ''}`} />
                {errors.pickupLocation && <p className="text-red-400 text-xs mt-1">⚠ {errors.pickupLocation}</p>}
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Drop Location</label>
                <input name="dropLocation" value={form.dropLocation} onChange={handleChange}
                  placeholder="Enter drop address"
                  className={`input ${errors.dropLocation ? 'input-error' : ''}`} />
                {errors.dropLocation && <p className="text-red-400 text-xs mt-1">⚠ {errors.dropLocation}</p>}
              </div>
            </div>
          </div>

          {/* Coupon */}
          <div className="card p-6">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">🏷️ Coupon Code</h3>
            <CouponInput applied={coupon} onApply={setCoupon} onRemove={() => setCoupon(null)} />
          </div>
        </div>

        {/* Summary */}
        <div className="card p-6 h-fit sticky top-24">
          <h3 className="font-semibold text-white mb-4">Booking Summary</h3>
          <div className="flex gap-3 mb-4">
            <img src={bike?.image} alt={bike?.name} className="w-16 h-12 rounded-lg object-cover" />
            <div>
              <div className="font-medium text-white text-sm">{bike?.name}</div>
              <div className="text-slate-400 text-xs capitalize">{bike?.type}</div>
            </div>
          </div>
          <div className="space-y-2 text-sm border-t border-slate-700 pt-4 mb-4">
            <div className="flex justify-between text-slate-400">
              <span>Duration</span><span className="text-white">{totalHours}h</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Rate</span>
              <span className="text-white">{totalHours >= 24 ? `₹${bike?.pricePerDay}/day` : `₹${bike?.pricePerHour}/hr`}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Subtotal</span><span className="text-white">₹{basePrice}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-400">
                <span>Discount ({coupon.discountPercent}%)</span><span>-₹{discount}</span>
              </div>
            )}
          </div>
          <div className="flex justify-between font-bold text-lg border-t border-slate-700 pt-4 mb-6">
            <span className="text-white">Total</span>
            <span className="gradient-text">₹{totalPrice}</span>
          </div>
          <button onClick={handleBooking} disabled={submitting}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed">
            {submitting ? 'Booking...' : 'Confirm Booking'}
          </button>
          <p className="text-xs text-slate-500 text-center mt-3">✅ Free Booking - No Payment Required</p>
        </div>
      </div>
    </div>
  );
}
