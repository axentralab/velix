import { Link } from 'react-router-dom';
import Input from '../components/common/Input.jsx';
import Button from '../components/common/Button.jsx';

export default function Login() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Welcome back</p>
        <h1 className="mt-3 text-4xl font-bold text-white">Sign in to your account</h1>
      </div>
      <div className="space-y-4">
        <Input label="Email" type="email" placeholder="you@example.com" />
        <Input label="Password" type="password" placeholder="••••••••" />
      </div>
      <div className="flex items-center justify-between text-sm text-slate-400">
        <Link to="/auth/forgot-password" className="hover:text-white">Forgot password?</Link>
      </div>
      <Button type="submit" className="w-full">Sign in</Button>
      <p className="text-center text-sm text-slate-400">
        Don’t have an account?{' '}
        <Link to="/auth/register" className="font-semibold text-white hover:text-gold">Create one</Link>
      </p>
    </div>
  );
}
