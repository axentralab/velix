import { Link } from 'react-router-dom';
import Input from '../components/common/Input.jsx';
import Button from '../components/common/Button.jsx';

export default function ResetPassword() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">New password</p>
        <h1 className="mt-3 text-4xl font-bold text-white">Set a new password</h1>
      </div>
      <Input label="New password" type="password" placeholder="••••••••" />
      <Input label="Confirm password" type="password" placeholder="••••••••" />
      <Button className="w-full">Reset password</Button>
      <p className="text-center text-sm text-slate-400">
        Back to{' '}
        <Link to="/auth/login" className="font-semibold text-white hover:text-gold">Login</Link>
      </p>
    </div>
  );
}
