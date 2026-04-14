import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBiking, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useForm } from '../hooks/useForm';
import FormField from '../components/FormField';
import toast from 'react-hot-toast';

const validate = (v) => {
  const errs = {};
  if (!v.name.trim()) errs.name = 'Name is required';
  else if (v.name.trim().length < 2) errs.name = 'Name must be at least 2 characters';
  if (!v.email) errs.email = 'Email is required';
  else if (!/\S+@\S+\.\S+/.test(v.email)) errs.email = 'Enter a valid email';
  if (v.phone && !/^\+?[\d\s-]{10,}$/.test(v.phone)) errs.phone = 'Enter a valid phone number';
  if (!v.password) errs.password = 'Password is required';
  else if (v.password.length < 6) errs.password = 'Password must be at least 6 characters';
  return errs;
};

export default function Register() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { values, errors, touched, handleChange, handleBlur, validateAll } = useForm(
    { name: '', email: '', phone: '', password: '' }, validate
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;
    setLoading(true);
    try {
      await register(values.name, values.email, values.password, values.phone);
      toast.success('Account created successfully! 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16 py-8 page-enter">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 text-2xl font-bold gradient-text mb-2">
            <FaBiking className="text-indigo-400" /> Jolly Cabs
          </div>
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
          <p className="text-slate-400 text-sm mt-1">Join thousands of happy riders</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {[
              { label: 'Full Name', name: 'name', type: 'text', placeholder: 'John Doe' },
              { label: 'Email', name: 'email', type: 'email', placeholder: 'you@example.com' },
              { label: 'Phone (optional)', name: 'phone', type: 'tel', placeholder: '+91 99999 99999' },
            ].map(f => (
              <FormField key={f.name} label={f.label} error={errors[f.name]} touched={touched[f.name]}>
                <input type={f.type} name={f.name} value={values[f.name]}
                  onChange={handleChange} onBlur={handleBlur}
                  placeholder={f.placeholder}
                  className={`input ${touched[f.name] && errors[f.name] ? 'input-error' : ''}`} />
              </FormField>
            ))}

            <FormField label="Password" error={errors.password} touched={touched.password}>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} name="password" value={values.password}
                  onChange={handleChange} onBlur={handleBlur}
                  placeholder="Min 6 characters"
                  className={`input pr-10 ${touched.password && errors.password ? 'input-error' : ''}`} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                  {showPass ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </FormField>

            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-slate-400 text-sm mt-4">
            Already have an account? <Link to="/login" className="text-indigo-400 hover:text-indigo-300">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
