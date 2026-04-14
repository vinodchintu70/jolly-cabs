import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBiking, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useForm } from '../hooks/useForm';
import FormField from '../components/FormField';
import toast from 'react-hot-toast';

const validate = (v) => {
  const errs = {};
  if (!v.email) errs.email = 'Email is required';
  else if (!/\S+@\S+\.\S+/.test(v.email)) errs.email = 'Enter a valid email';
  if (!v.password) errs.password = 'Password is required';
  return errs;
};

export default function Login() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { values, errors, touched, handleChange, handleBlur, validateAll } = useForm({ email: '', password: '' }, validate);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;
    setLoading(true);
    try {
      const user = await login(values.email, values.password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16 page-enter">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 text-2xl font-bold gradient-text mb-2">
            <FaBiking className="text-indigo-400" /> Jolly Cabs
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
          <p className="text-slate-400 text-sm mt-1">Sign in to your account</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <FormField label="Email" error={errors.email} touched={touched.email}>
              <input type="email" name="email" value={values.email}
                onChange={handleChange} onBlur={handleBlur}
                placeholder="you@example.com"
                className={`input ${touched.email && errors.email ? 'input-error' : ''}`} />
            </FormField>

            <FormField label="Password" error={errors.password} touched={touched.password}>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} name="password" value={values.password}
                  onChange={handleChange} onBlur={handleBlur}
                  placeholder="••••••••"
                  className={`input pr-10 ${touched.password && errors.password ? 'input-error' : ''}`} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                  {showPass ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </FormField>

            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className="text-center text-slate-400 text-sm mt-4">
            Don't have an account? <Link to="/register" className="text-indigo-400 hover:text-indigo-300">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
