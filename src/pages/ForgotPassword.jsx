import { Link } from 'react-router-dom';
import Input from '../components/common/Input.jsx';
import Button from '../components/common/Button.jsx';

export default function ForgotPassword() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Reset password</p>
        <h1 className="mt-3 text-4xl font-bold text-white">Recover your account</h1>
      </div>
      <p className="text-sm leading-7 text-slate-300">
        Enter your email address and we’ll send a password reset link to your inbox.
      </p>
      <Input label="Email" type="email" placeholder="you@example.com" />
      <Button className="w-full">Send reset link</Button>
      <p className="text-center text-sm text-slate-400">
        Remembered your password?{' '}
        <Link to="/auth/login" className="font-semibold text-white hover:text-gold">Sign in</Link>
      </p>
    </div>
  );
}
