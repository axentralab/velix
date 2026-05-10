import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Input from '../components/common/Input.jsx';
import Button from '../components/common/Button.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { resetPassword, loading } = useAuth();
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [message, setMessage] = useState({ type: '', text: '' });
  const token = searchParams.get('token');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage({ type: '', text: '' });

    if (!token) {
      setMessage({ type: 'error', text: 'Reset token is missing from the URL.' });
      return;
    }

    if (!form.password || !form.confirmPassword) {
      setMessage({ type: 'error', text: 'Please fill in both password fields.' });
      return;
    }

    if (form.password !== form.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    try {
      await resetPassword({ token, password: form.password });
      navigate('/auth/login');
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || err.message || 'Unable to reset password.',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">New password</p>
        <h1 className="mt-3 text-4xl font-bold text-white">Set a new password</h1>
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
      <Input
        label="New password"
        name="password"
        type="password"
        placeholder="••••••••"
        value={form.password}
        onChange={handleChange}
      />
      <Input
        label="Confirm password"
        name="confirmPassword"
        type="password"
        placeholder="••••••••"
        value={form.confirmPassword}
        onChange={handleChange}
      />
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Resetting password...' : 'Reset password'}
      </Button>
      <p className="text-center text-sm text-slate-400">
        Back to{' '}
        <Link to="/auth/login" className="font-semibold text-white hover:text-gold">Login</Link>
      </p>
    </form>
  );
}
