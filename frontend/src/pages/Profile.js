import { useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaEdit, FaSave } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, login } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);
  const [changingPw, setChangingPw] = useState(false);

  const handleSave = async () => {
    if (!form.name.trim()) return toast.error('Name is required');
    setSaving(true);
    try {
      await api.put('/auth/profile', form);
      toast.success('Profile updated!');
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword.length < 6) return toast.error('Password must be at least 6 characters');
    if (pwForm.newPassword !== pwForm.confirmPassword) return toast.error('Passwords do not match');
    setChangingPw(true);
    try {
      await api.put('/auth/change-password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success('Password changed successfully!');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setChangingPw(false);
    }
  };

  return (
    <div className="pt-24 min-h-screen max-w-3xl mx-auto px-4 pb-12 page-enter">
      <h1 className="text-3xl font-bold text-white mb-8">My <span className="gradient-text">Profile</span></h1>

      {/* Profile Card */}
      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
              {user?.name?.[0]}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{user?.name}</h2>
              <span className={`badge ${user?.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
                {user?.role}
              </span>
            </div>
          </div>
          <button onClick={() => setEditing(!editing)} className="btn-outline py-2 px-4 text-sm flex items-center gap-2">
            <FaEdit /> {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-400 mb-1 flex items-center gap-2"><FaUser /> Full Name</label>
            {editing ? (
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input" />
            ) : (
              <p className="text-white font-medium">{user?.name}</p>
            )}
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 flex items-center gap-2"><FaEnvelope /> Email</label>
            <p className="text-white font-medium">{user?.email}</p>
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 flex items-center gap-2"><FaPhone /> Phone</label>
            {editing ? (
              <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="input" placeholder="+91 99999 99999" />
            ) : (
              <p className="text-white font-medium">{user?.phone || 'Not provided'}</p>
            )}
          </div>
          {editing && (
            <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2 disabled:opacity-50">
              <FaSave /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          )}
        </div>
      </div>

      {/* Change Password */}
      <div className="card p-6">
        <h3 className="font-semibold text-white mb-4">Change Password</h3>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          {[
            { key: 'currentPassword', label: 'Current Password' },
            { key: 'newPassword', label: 'New Password' },
            { key: 'confirmPassword', label: 'Confirm New Password' },
          ].map(f => (
            <div key={f.key}>
              <label className="text-sm text-slate-400 mb-1 block">{f.label}</label>
              <input type="password" value={pwForm[f.key]}
                onChange={e => setPwForm(p => ({ ...p, [f.key]: e.target.value }))}
                className="input" required />
            </div>
          ))}
          <button type="submit" disabled={changingPw} className="btn-primary disabled:opacity-50">
            {changingPw ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
