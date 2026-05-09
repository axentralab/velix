import { Link } from 'react-router-dom';
import Input from '../components/common/Input.jsx';
import Button from '../components/common/Button.jsx';

export default function Register() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Create account</p>
        <h1 className="mt-3 text-4xl font-bold text-white">Get started with Velix</h1>
      </div>
      <div className="space-y-4">
        <Input label="Name" placeholder="Your name" />
        <Input label="Email" type="email" placeholder="you@example.com" />
        <Input label="Password" type="password" placeholder="••••••••" />
      </div>
      <Button type="submit" className="w-full">Create account</Button>
      <p className="text-center text-sm text-slate-400">
        Already a member?{' '}
        <Link to="/auth/login" className="font-semibold text-white hover:text-gold">Sign in</Link>
      </p>
    </div>
  );
}
