import { useEffect, useState } from 'react';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import api from '../utils/api';
import BikeCard from '../components/BikeCard';
import Loader from '../components/Loader';

const types = ['all', 'scooter', 'sports', 'cruiser', 'electric', 'mountain'];

export default function Bikes() {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('all');
  const [available, setAvailable] = useState('all');
  const [maxPrice, setMaxPrice] = useState('');
  const [showFilter, setShowFilter] = useState(false);

  const fetchBikes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (type !== 'all') params.append('type', type);
      if (available !== 'all') params.append('available', available);
      if (maxPrice) params.append('maxPrice', maxPrice);
      const { data } = await api.get(`/bikes?${params}`);
      setBikes(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBikes(); }, [type, available, maxPrice]);

  const handleSearch = (e) => { e.preventDefault(); fetchBikes(); };

  const clearFilters = () => { setType('all'); setAvailable('all'); setMaxPrice(''); setSearch(''); };

  return (
    <div className="pt-24 min-h-screen max-w-7xl mx-auto px-4 pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Our <span className="gradient-text">Bike Fleet</span></h1>
        <p className="text-slate-400">Find the perfect bike for your journey</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search bikes..." className="input pl-10" />
          </div>
          <button type="submit" className="btn-primary px-6">Search</button>
        </form>
        <button onClick={() => setShowFilter(!showFilter)} className="btn-outline flex items-center gap-2 md:hidden">
          <FaFilter /> Filters
        </button>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters */}
        <aside className={`${showFilter ? 'block' : 'hidden'} md:block w-full md:w-64 shrink-0`}>
          <div className="card p-5 sticky top-24">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-white">Filters</h3>
              <button onClick={clearFilters} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"><FaTimes /> Clear</button>
            </div>

            <div className="mb-5">
              <label className="text-sm text-slate-400 mb-2 block">Bike Type</label>
              <div className="flex flex-wrap gap-2">
                {types.map(t => (
                  <button key={t} onClick={() => setType(t)}
                    className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-all ${type === t ? 'bg-indigo-500 text-white' : 'glass text-slate-300 hover:border-indigo-500'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <label className="text-sm text-slate-400 mb-2 block">Availability</label>
              <select value={available} onChange={e => setAvailable(e.target.value)} className="input text-sm">
                <option value="all">All</option>
                <option value="true">Available</option>
                <option value="false">Booked</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-slate-400 mb-2 block">Max Price/Day (₹)</label>
              <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="e.g. 1000" className="input text-sm" />
            </div>
          </div>
        </aside>

        {/* Bikes Grid */}
        <div className="flex-1">
          {loading ? <Loader /> : bikes.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <FaSearch className="text-5xl mx-auto mb-4 opacity-30" />
              <p>No bikes found. Try adjusting your filters.</p>
            </div>
          ) : (
            <>
              <p className="text-slate-400 text-sm mb-4">{bikes.length} bikes found</p>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {bikes.map(bike => <BikeCard key={bike._id} bike={bike} />)}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
