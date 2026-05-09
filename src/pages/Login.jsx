import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/common/Input.jsx';
import Button from '../components/common/Button.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function Login() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage({ type: '', text: '' });

    if (!form.email || !form.password) {
      setMessage({ type: 'error', text: 'Please enter both email and password.' });
      return;
    }

    try {
      await login({ email: form.email, password: form.password });
      navigate('/');
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || err.message || 'Unable to sign in.',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Welcome back</p>
        <h1 className="mt-3 text-4xl font-bold text-white">Sign in to your account</h1>
      </div>
      {message.text && (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            message.type === 'error'
              ? 'border-rose-100 bg-rose-50 text-rose-700'
              : 'border-emerald-100 bg-emerald-50 text-emerald-700'
          }`}
          role="alert"
        >
          {message.text}
        </div>
      )}
      <div className="space-y-4">
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
        />
        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
        />
      </div>
      <div className="flex items-center justify-between text-sm text-slate-400">
        <Link to="/auth/forgot-password" className="hover:text-white">Forgot password?</Link>
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Signing in...' : 'Sign in'}
      </Button>
      <p className="text-center text-sm text-slate-400">
        Don’t have an account?{' '}
        <Link to="/auth/register" className="font-semibold text-white hover:text-gold">Create one</Link>
      </p>
    </form>
  );
}
