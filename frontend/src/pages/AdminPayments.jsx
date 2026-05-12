import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { getAllOrders, verifyPayment } from '../services/orders.js';
import { formatPrice } from '../utils/formatPrice.js';
import Loader from '../components/common/Loader.jsx';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@veloura.com';

export default function AdminPayments() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verifyingOrder, setVerifyingOrder] = useState(null);
  const [verificationForm, setVerificationForm] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersData = await getAllOrders();
        setOrders(ordersData.filter((o) => o.payment?.status === 'pending'));
      } catch (err) {
        setError('Unable to load orders.');
        console.error('Admin payments fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleVerifyPayment = async (orderNumber) => {
    const form = verificationForm[orderNumber];
    if (!form?.transactionId) {
      alert('Please enter transaction ID');
      return;
    }

    try {
      const order = orders.find((o) => o.orderNumber === orderNumber);
      await verifyPayment(orderNumber, {
        transactionId: form.transactionId,
        method: order.payment.method,
      });

      setOrders((prev) => prev.filter((o) => o.orderNumber !== orderNumber));
      alert('Payment verified successfully!');
      setVerifyingOrder(null);
      setVerificationForm({});
    } catch (err) {
      console.error('Payment verification failed:', err);
      alert('Failed to verify payment.');
    }
  };

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="text-4xl font-bold text-slate-950 mb-4">Admin Access Required</h1>
        <p className="text-slate-600 mb-8">You must sign in with the admin account.</p>
        <Link to="/auth/login" className="inline-flex items-center justify-center rounded-full bg-slate-950 px-8 py-4 text-sm font-semibold text-white transition hover:bg-slate-800">
          Sign in
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex justify-center">
          <Loader />
        </div>
      </div>
    );
  }

  const pendingPaymentOrders = orders.filter((o) => o.payment?.status === 'pending');
  const focusOrder = searchParams.get('order');

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-950">Payment Verification</h1>
        <p className="mt-2 text-slate-600">Verify manual payments (bKash, Nagad, Rocket, etc.)</p>
      </div>

      {error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-rose-700">{error}</div>
      ) : (
        <div className="space-y-6">
          {pendingPaymentOrders.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center text-slate-700">
              ✅ All payments verified!
            </div>
          ) : (
            <div className="space-y-4">
              {pendingPaymentOrders.map((order) => (
                <div key={order.orderNumber} className="rounded-3xl border border-slate-200 bg-white p-6">
                  <div className="flex items-start justify-between gap-6 mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-950">{order.orderNumber}</h3>
                      <p className="text-sm text-slate-600 mt-1">{order.customer?.name} · {order.customer?.email}</p>
                      <p className="text-sm text-slate-600 mt-1">
                        Payment Method: <span className="font-semibold uppercase">{order.payment?.method}</span>
                      </p>
                      {order.payment?.bkashNumber && (
                        <p className="text-sm text-slate-600">bKash: {order.payment.bkashNumber}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-slate-950">{formatPrice(order.pricing?.total)}</p>
                      <span className="inline-flex mt-2 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-800">
                        Pending
                      </span>
                    </div>
                  </div>

                  {verifyingOrder === order.orderNumber ? (
                    <div className="mt-6 space-y-4 rounded-2xl bg-slate-50 p-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-950 mb-2">Transaction ID</label>
                        <input
                          type="text"
                          placeholder="Enter transaction ID"
                          value={verificationForm[order.orderNumber]?.transactionId || ''}
                          onChange={(e) => setVerificationForm({
                            ...verificationForm,
                            [order.orderNumber]: {
                              ...verificationForm[order.orderNumber],
                              transactionId: e.target.value
                            }
                          })}
                          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleVerifyPayment(order.orderNumber)}
                          className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
                        >
                          <FiCheckCircle size={16} /> Verify & Approve
                        </button>
                        <button
                          onClick={() => setVerifyingOrder(null)}
                          className="flex-1 rounded-full border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setVerifyingOrder(order.orderNumber)}
                      className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                      <FiCheckCircle size={16} /> Verify Payment
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
