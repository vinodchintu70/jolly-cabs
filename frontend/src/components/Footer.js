import { Link } from 'react-router-dom';
import { FaBiking, FaWhatsapp, FaInstagram, FaTwitter, FaFacebook } from 'react-icons/fa';

export default function Footer() {
  const whatsapp = process.env.REACT_APP_WHATSAPP_NUMBER;
  return (
    <footer className="bg-slate-900 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 text-xl font-bold gradient-text mb-3">
            <FaBiking className="text-indigo-400" /> Jolly Cabs
          </div>
          <p className="text-slate-400 text-sm">Premium bike rentals for every adventure. Ride with style and comfort.</p>
          <div className="flex gap-3 mt-4">
            {[FaInstagram, FaTwitter, FaFacebook].map((Icon, i) => (
              <a key={i} href="#" className="text-slate-400 hover:text-indigo-400 transition-colors"><Icon size={20} /></a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3">Quick Links</h4>
          <div className="flex flex-col gap-2 text-sm text-slate-400">
            {[['/', 'Home'], ['/bikes', 'Bikes'], ['/contact', 'Contact']].map(([to, label]) => (
              <Link key={to} to={to} className="hover:text-indigo-400 transition-colors">{label}</Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3">Support</h4>
          <div className="flex flex-col gap-2 text-sm text-slate-400">
            <span>support@jollycabs.com</span>
            <span>+91 99999 99999</span>
            <span>Mon-Sun: 8AM - 10PM</span>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3">Contact Us</h4>
          <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer"
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm transition-colors w-fit">
            <FaWhatsapp size={18} /> WhatsApp Us
          </a>
        </div>
      </div>
      <div className="border-t border-slate-800 text-center py-4 text-slate-500 text-sm">
        © {new Date().getFullYear()} Jolly Cabs. All rights reserved.
      </div>
    </footer>
  );
}
