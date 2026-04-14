import { useEffect, useState } from 'react';
import { FaBiking, FaUsers, FaRupeeSign, FaClipboardList, FaPlus, FaEdit, FaTrash, FaTag } from 'react-icons/fa';
import api from '../utils/api';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const statusColors = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  confirmed: 'bg-green-500/20 text-green-400',
  cancelled: 'bg-red-500/20 text-red-400',
  completed: 'bg-blue-500/20 text-blue-400',
};

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function MiniBarChart({ data }) {
  if (!data?.length) return <p className="text-slate-400 text-sm">No data yet</p>;
  const max = Math.max(...data.map(d => d.revenue));
  return (
    <div className="flex items-end gap-2 h-24">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full bg-indigo-500/20 rounded-t-sm relative" style={{ height: `${(d.revenue / max) * 80}px` }}>
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t-sm opacity-80" />
          </div>
          <span className="text-xs text-slate-500">{MONTHS[(d._id.month - 1)]}</span>
        </div>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const [tab, setTab] = useState('dashboard');
  const [analytics, setAnalytics] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [bikes, setBikes] = useState([]);
  const [users, setUsers] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bikeForm, setBikeForm] = useState({ name: '', brand: '', type: 'scooter', image: '', pricePerHour: '', pricePerDay: '', description: '' });
  const [editingBike, setEditingBike] = useState(null);
  const [couponForm, setCouponForm] = useState({ code: '', discountPercent: '', maxUses: 100, expiresAt: '' });

  useEffect(() => {
    Promise.all([
      api.get('/admin/analytics'),
      api.get('/admin/bookings'),
      api.get('/bikes'),
      api.get('/admin/users'),
      api.get('/coupons'),
    ]).then(([a, b, bk, u, c]) => {
      setAnalytics(a.data);
      setBookings(b.data);
      setBikes(bk.data);
      setUsers(u.data);
      setCoupons(c.data);
    }).finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/admin/bookings/${id}/status`, { status });
    setBookings(prev => prev.map(b => b._id === id ? { ...b, status } : b));
    toast.success('Status updated');
  };

  const handleBikeSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBike) {
        const { data } = await api.put(`/bikes/${editingBike}`, bikeForm);
        setBikes(prev => prev.map(b => b._id === editingBike ? data : b));
        toast.success('Bike updated');
      } else {
        const { data } = await api.post('/bikes', bikeForm);
        setBikes(prev => [...prev, data]);
        toast.success('Bike added');
      }
      setBikeForm({ name: '', brand: '', type: 'scooter', image: '', pricePerHour: '', pricePerDay: '', description: '' });
      setEditingBike(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving bike');
    }
  };

  const deleteBike = async (id) => {
    if (!window.confirm('Delete this bike?')) return;
    await api.delete(`/bikes/${id}`);
    setBikes(prev => prev.filter(b => b._id !== id));
    toast.success('Bike deleted');
  };

  const editBike = (bike) => {
    setEditingBike(bike._id);
    setBikeForm({ name: bike.name, brand: bike.brand, type: bike.type, image: bike.image, pricePerHour: bike.pricePerHour, pricePerDay: bike.pricePerDay, description: bike.description || '' });
    setTab('bikes');
    window.scrollTo(0, 0);
  };

  const updateUserRole = async (id, role) => {
    const { data } = await api.put(`/admin/users/${id}/role`, { role });
    setUsers(prev => prev.map(u => u._id === id ? data : u));
    toast.success('Role updated');
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await api.delete(`/admin/users/${id}`);
    setUsers(prev => prev.filter(u => u._id !== id));
    toast.success('User deleted');
  };

  const handleCouponSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/coupons', couponForm);
      setCoupons(prev => [data, ...prev]);
      setCouponForm({ code: '', discountPercent: '', maxUses: 100, expiresAt: '' });
      toast.success('Coupon created');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error creating coupon');
    }
  };

  const deleteCoupon = async (id) => {
    await api.delete(`/coupons/${id}`);
    setCoupons(prev => prev.filter(c => c._id !== id));
    toast.success('Coupon deleted');
  };

  if (loading) return <div className="pt-24"><Loader /></div>;

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: FaClipboardList },
    { id: 'bookings', label: 'Bookings', icon: FaClipboardList },
    { id: 'bikes', label: 'Bikes', icon: FaBiking },
    { id: 'users', label: 'Users', icon: FaUsers },
    { id: 'coupons', label: 'Coupons', icon: FaTag },
  ];

  return (
    <div className="pt-24 min-h-screen max-w-7xl mx-auto px-4 pb-12 page-enter">
      <h1 className="text-3xl font-bold text-white mb-6">Admin <span className="gradient-text">Dashboard</span></h1>

      <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-800 pb-4">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === t.id ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
            <t.icon /> {t.label}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {tab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: FaClipboardList, label: 'Total Bookings', value: analytics?.totalBookings, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
              { icon: FaUsers, label: 'Total Users', value: analytics?.totalUsers, color: 'text-purple-400', bg: 'bg-purple-500/10' },
              { icon: FaRupeeSign, label: 'Total Revenue', value: `₹${analytics?.totalRevenue?.toLocaleString()}`, color: 'text-green-400', bg: 'bg-green-500/10' },
              { icon: FaBiking, label: 'Total Bikes', value: analytics?.totalBikes, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
            ].map((s, i) => (
              <div key={i} className="card p-5 flex items-center gap-4">
                <div className={`w-12 h-12 ${s.bg} rounded-xl flex items-center justify-center`}>
                  <s.icon className={`text-xl ${s.color}`} />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">{s.value}</div>
                  <div className="text-slate-400 text-xs">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <div className="card p-6">
              <h3 className="font-semibold text-white mb-4">Monthly Revenue</h3>
              <MiniBarChart data={analytics?.monthlyRevenue} />
            </div>

            {/* Bookings by Status */}
            <div className="card p-6">
              <h3 className="font-semibold text-white mb-4">Bookings by Status</h3>
              <div className="space-y-3">
                {analytics?.bookingsByStatus?.map(s => (
                  <div key={s._id} className="flex items-center gap-3">
                    <span className={`badge capitalize ${statusColors[s._id]}`}>{s._id}</span>
                    <div className="flex-1 bg-slate-700 rounded-full h-2">
                      <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${(s.count / analytics.totalBookings) * 100}%` }} />
                    </div>
                    <span className="text-white text-sm font-medium">{s.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Bikes */}
          <div className="card p-6">
            <h3 className="font-semibold text-white mb-4">Top Performing Bikes</h3>
            <div className="space-y-3">
              {analytics?.topBikes?.map((b, i) => (
                <div key={b._id} className="flex items-center gap-4 py-2 border-b border-slate-700 last:border-0">
                  <span className="text-slate-500 text-sm w-5">#{i + 1}</span>
                  <img src={b.bike.image} alt={b.bike.name} className="w-12 h-8 rounded-lg object-cover" />
                  <div className="flex-1">
                    <div className="text-white text-sm font-medium">{b.bike.name}</div>
                    <div className="text-slate-400 text-xs">{b.count} bookings</div>
                  </div>
                  <div className="text-green-400 font-medium text-sm">₹{b.revenue?.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="card p-6">
            <h3 className="font-semibold text-white mb-4">Recent Bookings</h3>
            <div className="space-y-3">
              {analytics?.recentBookings?.map(b => (
                <div key={b._id} className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0">
                  <div>
                    <div className="text-white text-sm font-medium">{b.userId?.name}</div>
                    <div className="text-slate-400 text-xs">{b.bikeId?.name} · ₹{b.totalPrice}</div>
                  </div>
                  <span className={`badge capitalize ${statusColors[b.status]}`}>{b.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bookings Tab */}
      {tab === 'bookings' && (
        <div className="space-y-3">
          <p className="text-slate-400 text-sm mb-4">{bookings.length} total bookings</p>
          {bookings.map(b => (
            <div key={b._id} className="card p-4 flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-medium text-white">{b.userId?.name}</span>
                  <span className="text-slate-400 text-sm">→ {b.bikeId?.name}</span>
                  <span className={`badge capitalize ${statusColors[b.status]}`}>{b.status}</span>
                </div>
                <div className="text-slate-400 text-xs">{b.bookingId} · ₹{b.totalPrice} · {new Date(b.startDate).toDateString()} → {new Date(b.endDate).toDateString()}</div>
                <div className="text-slate-500 text-xs">{b.userId?.email}</div>
              </div>
              <select value={b.status} onChange={e => updateStatus(b._id, e.target.value)}
                className="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500">
                {['pending', 'confirmed', 'cancelled', 'completed'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          ))}
        </div>
      )}

      {/* Bikes Tab */}
      {tab === 'bikes' && (
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-white mb-4">{editingBike ? '✏️ Edit Bike' : '➕ Add New Bike'}</h3>
            <form onSubmit={handleBikeSubmit} className="card p-6 space-y-4">
              {[
                { key: 'name', label: 'Bike Name', placeholder: 'e.g. Royal Enfield Classic 350' },
                { key: 'brand', label: 'Brand', placeholder: 'e.g. Royal Enfield' },
                { key: 'image', label: 'Image URL', placeholder: 'https://...' },
                { key: 'pricePerHour', label: 'Price/Hour (₹)', placeholder: '99', type: 'number' },
                { key: 'pricePerDay', label: 'Price/Day (₹)', placeholder: '599', type: 'number' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs text-slate-400 mb-1 block">{f.label}</label>
                  <input type={f.type || 'text'} value={bikeForm[f.key]}
                    onChange={e => setBikeForm(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder} className="input text-sm" required />
                </div>
              ))}
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Type</label>
                <select value={bikeForm.type} onChange={e => setBikeForm(p => ({ ...p, type: e.target.value }))} className="input text-sm">
                  {['scooter', 'sports', 'cruiser', 'electric', 'mountain'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Description</label>
                <textarea value={bikeForm.description} onChange={e => setBikeForm(p => ({ ...p, description: e.target.value }))}
                  rows={2} className="input text-sm resize-none" placeholder="Short description..." />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2">
                  <FaPlus /> {editingBike ? 'Update Bike' : 'Add Bike'}
                </button>
                {editingBike && (
                  <button type="button" onClick={() => { setEditingBike(null); setBikeForm({ name: '', brand: '', type: 'scooter', image: '', pricePerHour: '', pricePerDay: '', description: '' }); }}
                    className="btn-outline px-4">Cancel</button>
                )}
              </div>
            </form>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">All Bikes ({bikes.length})</h3>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {bikes.map(b => (
                <div key={b._id} className="card p-3 flex items-center gap-3">
                  <img src={b.image} alt={b.name} className="w-16 h-12 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white text-sm truncate">{b.name}</div>
                    <div className="text-slate-400 text-xs">₹{b.pricePerHour}/hr · {b.type} · {b.availability ? '✓ Available' : '✗ Booked'}</div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => editBike(b)} className="text-indigo-400 hover:text-indigo-300 p-1 transition-colors"><FaEdit /></button>
                    <button onClick={() => deleteBike(b._id)} className="text-red-400 hover:text-red-300 p-1 transition-colors"><FaTrash /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {tab === 'users' && (
        <div>
          <p className="text-slate-400 text-sm mb-4">{users.length} registered users</p>
          <div className="space-y-3">
            {users.map(u => (
              <div key={u._id} className="card p-4 flex flex-col md:flex-row gap-3 items-start md:items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  {u.name?.[0]}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-white">{u.name}</div>
                  <div className="text-slate-400 text-sm">{u.email} · {u.phone || 'No phone'}</div>
                  <div className="text-slate-500 text-xs">Joined {new Date(u.createdAt).toDateString()}</div>
                </div>
                <div className="flex items-center gap-2">
                  <select value={u.role} onChange={e => updateUserRole(u._id, e.target.value)}
                    className="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500">
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button onClick={() => deleteUser(u._id)} className="btn-danger py-1.5 px-3 text-sm"><FaTrash /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Coupons Tab */}
      {tab === 'coupons' && (
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-white mb-4">➕ Create Coupon</h3>
            <form onSubmit={handleCouponSubmit} className="card p-6 space-y-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Coupon Code</label>
                <input value={couponForm.code} onChange={e => setCouponForm(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                  placeholder="e.g. JOLLY20" className="input text-sm" required />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Discount (%)</label>
                <input type="number" min="1" max="100" value={couponForm.discountPercent}
                  onChange={e => setCouponForm(p => ({ ...p, discountPercent: e.target.value }))}
                  placeholder="e.g. 20" className="input text-sm" required />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Max Uses</label>
                <input type="number" value={couponForm.maxUses}
                  onChange={e => setCouponForm(p => ({ ...p, maxUses: e.target.value }))}
                  className="input text-sm" required />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Expires At</label>
                <input type="date" value={couponForm.expiresAt}
                  onChange={e => setCouponForm(p => ({ ...p, expiresAt: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]} className="input text-sm" required />
              </div>
              <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                <FaTag /> Create Coupon
              </button>
            </form>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">All Coupons ({coupons.length})</h3>
            <div className="space-y-3">
              {coupons.map(c => (
                <div key={c._id} className="card p-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-indigo-400">{c.code}</span>
                      <span className={`badge ${c.isActive && new Date() < new Date(c.expiresAt) ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {c.isActive && new Date() < new Date(c.expiresAt) ? 'Active' : 'Expired'}
                      </span>
                    </div>
                    <div className="text-slate-400 text-xs">{c.discountPercent}% off · {c.usedCount}/{c.maxUses} used · Expires {new Date(c.expiresAt).toDateString()}</div>
                  </div>
                  <button onClick={() => deleteCoupon(c._id)} className="text-red-400 hover:text-red-300 p-1 transition-colors"><FaTrash /></button>
                </div>
              ))}
              {coupons.length === 0 && <p className="text-slate-400 text-sm text-center py-8">No coupons yet</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
