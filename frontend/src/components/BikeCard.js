import { Link } from 'react-router-dom';
import { FaStar, FaGasPump, FaTachometerAlt } from 'react-icons/fa';

export default function BikeCard({ bike }) {
  return (
    <div className="card group cursor-pointer">
      <div className="relative overflow-hidden h-48">
        <img src={bike.image} alt={bike.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${bike.availability ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
            {bike.availability ? 'Available' : 'Booked'}
          </span>
        </div>
        <div className="absolute top-3 right-3 glass px-2 py-1 rounded-full text-xs flex items-center gap-1">
          <FaStar className="text-yellow-400" /> {bike.rating}
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-white">{bike.name}</h3>
            <p className="text-slate-400 text-sm capitalize">{bike.brand} · {bike.type}</p>
          </div>
        </div>
        <div className="flex gap-4 text-xs text-slate-400 mb-4">
          {bike.specs?.mileage && <span className="flex items-center gap-1"><FaGasPump className="text-indigo-400" />{bike.specs.mileage}</span>}
          {bike.specs?.power && <span className="flex items-center gap-1"><FaTachometerAlt className="text-purple-400" />{bike.specs.power}</span>}
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-indigo-400 font-bold text-lg">₹{bike.pricePerHour}</span>
            <span className="text-slate-400 text-sm">/hr</span>
          </div>
          <Link to={`/bikes/${bike._id}`} className="btn-primary py-2 px-4 text-sm">Book Now</Link>
        </div>
      </div>
    </div>
  );
}
