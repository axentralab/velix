import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Button from '../components/common/Button.jsx';

export default function OrderSuccess() {
  const location = useLocation();
  const { orderNumber, isGuest } = location.state || {};
  const [showAccountPrompt, setShowAccountPrompt] = useState(isGuest);

  return (
    <div className="mx-auto max-w-4xl px-6 py-20 text-center">
      <div className="inline-flex rounded-3xl border border-gold/30 bg-gold/5 px-8 py-6 text-slate-950">
        <p className="text-sm uppercase tracking-[0.3em]">Order confirmed</p>
      </div>
      <h1 className="mt-8 text-5xl font-bold text-slate-950">Thank you for your purchase.</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600 mx-auto">
        Your order is being prepared. We will send tracking details to your inbox shortly.
      </p>

      {orderNumber && (
        <div className="mt-6 inline-flex rounded-2xl bg-slate-100 px-6 py-3 text-slate-950">
          <span className="text-sm font-medium">Order #{orderNumber}</span>
        </div>
      )}

      {/* Account Creation Prompt for Guest Users */}
      {showAccountPrompt && (
        <div className="mt-8 rounded-3xl border border-blue-200 bg-blue-50 p-8 text-left">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 text-xl">👤</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-slate-950 mb-2">
                Create an account to track your orders
              </h3>
              <p className="text-slate-600 mb-6">
                Save your order history, track shipments, and get personalized recommendations.
                Set a password now to create your account with the email you used for this order.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/auth/register"
                  state={{ email: location.state?.email }}
                  className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Create Account
                </Link>
                <button
                  onClick={() => setShowAccountPrompt(false)}
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-50"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link to="/orders" className="rounded-full bg-slate-950 px-8 py-4 text-sm font-semibold text-white transition hover:bg-slate-800">
          View orders
        </Link>
        <Link to="/shop" className="rounded-full border border-slate-300 px-8 py-4 text-sm font-semibold text-slate-950 transition hover:bg-slate-50">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
