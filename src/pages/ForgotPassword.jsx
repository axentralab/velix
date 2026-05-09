import { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../components/common/Input.jsx';
import Button from '../components/common/Button.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function ForgotPassword() {
  const { forgotPassword, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage({ type: '', text: '' });

    if (!email) {
      setMessage({ type: 'error', text: 'Please enter your email address.' });
      return;
    }

    try {
      await forgotPassword(email);
      setMessage({
        type: 'success',
        text: 'If an account exists with that email, we have sent password reset instructions.',
      });
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || err.message || 'Unable to send reset link.',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Reset password</p>
        <h1 className="mt-3 text-4xl font-bold text-white">Recover your account</h1>
      </div>
      <p className="text-sm leading-7 text-slate-300">
        Enter your email address and we’ll send a password reset link to your inbox.
      </p>
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
        label="Email"
        name="email"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Sending link...' : 'Send reset link'}
      </Button>
      <p className="text-center text-sm text-slate-400">
        Remembered your password?{' '}
        <Link to="/auth/login" className="font-semibold text-white hover:text-gold">Sign in</Link>
      </p>
    </form>
  );
}
