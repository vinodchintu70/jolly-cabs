import { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Reviews({ bikeId }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [hovered, setHovered] = useState(0);

  useEffect(() => {
    api.get(`/reviews/${bikeId}`).then(r => setReviews(r.data));
  }, [bikeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.comment.trim()) return toast.error('Please write a comment');
    setSubmitting(true);
    try {
      const { data } = await api.post(`/reviews/${bikeId}`, form);
      setReviews(prev => [data, ...prev]);
      setForm({ rating: 5, comment: '' });
      toast.success('Review submitted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    await api.delete(`/reviews/${id}`);
    setReviews(prev => prev.filter(r => r._id !== id));
    toast.success('Review deleted');
  };

  return (
    <div className="mt-10">
      <h3 className="text-xl font-bold text-white mb-6">
        Reviews <span className="text-slate-400 text-base font-normal">({reviews.length})</span>
      </h3>

      {user && (
        <form onSubmit={handleSubmit} className="card p-6 mb-6">
          <h4 className="font-semibold text-white mb-4">Write a Review</h4>
          <div className="flex gap-1 mb-4">
            {[1, 2, 3, 4, 5].map(star => (
              <button key={star} type="button"
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setForm(f => ({ ...f, rating: star }))}>
                <FaStar className={`text-2xl transition-colors ${star <= (hovered || form.rating) ? 'text-yellow-400' : 'text-slate-600'}`} />
              </button>
            ))}
          </div>
          <textarea value={form.comment} onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
            placeholder="Share your experience..." rows={3} className="input resize-none mb-3" required />
          <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-50">
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-slate-400 text-center py-8">No reviews yet. Be the first to review!</p>
        ) : reviews.map(r => (
          <div key={r._id} className="card p-5">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {r.userId?.name?.[0]}
                </div>
                <div>
                  <div className="font-medium text-white text-sm">{r.userId?.name}</div>
                  <div className="text-slate-500 text-xs">{new Date(r.createdAt).toDateString()}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => <FaStar key={i} className={`text-sm ${i < r.rating ? 'text-yellow-400' : 'text-slate-600'}`} />)}
                </div>
                {(user?._id === r.userId?._id || user?.role === 'admin') && (
                  <button onClick={() => handleDelete(r._id)} className="text-red-400 hover:text-red-300 text-xs ml-2">Delete</button>
                )}
              </div>
            </div>
            <p className="text-slate-300 text-sm">{r.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
