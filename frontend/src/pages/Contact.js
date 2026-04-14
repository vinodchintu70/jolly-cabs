import { useState } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaWhatsapp } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Message sent! We\'ll get back to you soon.');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="pt-24 min-h-screen max-w-6xl mx-auto px-4 pb-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-white mb-3">Get In <span className="gradient-text">Touch</span></h1>
        <p className="text-slate-400">We're here to help with any questions</p>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <div className="space-y-5 mb-8">
            {[
              { icon: FaMapMarkerAlt, title: 'Our Location', info: '123 Bike Street, Mumbai, Maharashtra 400001' },
              { icon: FaPhone, title: 'Phone', info: '+91 99999 99999' },
              { icon: FaEnvelope, title: 'Email', info: 'support@jollycabs.com' },
            ].map((c, i) => (
              <div key={i} className="card p-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center">
                  <c.icon className="text-indigo-400 text-xl" />
                </div>
                <div>
                  <div className="font-medium text-white">{c.title}</div>
                  <div className="text-slate-400 text-sm">{c.info}</div>
                </div>
              </div>
            ))}
          </div>
          <a href={`https://wa.me/${process.env.REACT_APP_WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer"
            className="flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl transition-colors w-fit">
            <FaWhatsapp size={24} />
            <div>
              <div className="font-semibold">Chat on WhatsApp</div>
              <div className="text-green-200 text-sm">Usually replies in minutes</div>
            </div>
          </a>
        </div>

        <div className="card p-8">
          <h2 className="text-xl font-bold text-white mb-6">Send a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Name</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Your name" className="input" required />
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="your@email.com" className="input" required />
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Message</label>
              <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                placeholder="How can we help?" rows={5} className="input resize-none" required />
            </div>
            <button type="submit" className="btn-primary w-full">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
}
