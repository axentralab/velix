import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/common/Input.jsx';
import Button from '../components/common/Button.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function Register() {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage({ type: '', text: '' });

    if (!form.name || !form.email || !form.password) {
      setMessage({ type: 'error', text: 'Please complete all fields to create your account.' });
      return;
    }

    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || err.message || 'Unable to create account.',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Create account</p>
        <h1 className="mt-3 text-4xl font-bold text-white">Get started with Velix</h1>
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
          label="Name"
          name="name"
          placeholder="Your name"
          value={form.name}
          onChange={handleChange}
        />
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
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Creating account...' : 'Create account'}
      </Button>
      <p className="text-center text-sm text-slate-400">
        Already a member?{' '}
        <Link to="/auth/login" className="font-semibold text-white hover:text-gold">Sign in</Link>
      </p>
    </form>
  );
}
