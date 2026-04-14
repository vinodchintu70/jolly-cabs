import { useState } from 'react';
import { FaTag, FaCheckCircle } from 'react-icons/fa';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function CouponInput({ onApply, onRemove, applied }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    if (!code.trim()) return toast.error('Enter a coupon code');
    setLoading(true);
    try {
      const { data } = await api.post('/coupons/validate', { code });
      onApply(data);
      toast.success(`${data.discountPercent}% discount applied!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => { setCode(''); onRemove(); };

  if (applied) {
    return (
      <div className="flex items-center justify-between bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3">
        <div className="flex items-center gap-2 text-green-400">
          <FaCheckCircle />
          <span className="font-medium">{applied.code}</span>
          <span className="text-sm">— {applied.discountPercent}% off</span>
        </div>
        <button onClick={handleRemove} className="text-slate-400 hover:text-white text-sm">Remove</button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <FaTag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
        <input value={code} onChange={e => setCode(e.target.value.toUpperCase())}
          placeholder="Enter coupon code" className="input pl-9 text-sm" />
      </div>
      <button onClick={handleApply} disabled={loading} className="btn-outline py-2 px-4 text-sm disabled:opacity-50">
        {loading ? '...' : 'Apply'}
      </button>
    </div>
  );
}
