import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { getAllShipments, createShipment, updateShipment } from '../services/orders.js';
import Loader from '../components/common/Loader.jsx';

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@veloura.com';

export default function AdminShipping() {
  const { user } = useAuth();
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ orderNumber: '', courier: '', trackingNumber: '' });
  const [selectedShipment, setSelectedShipment] = useState(null);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const data = await getAllShipments();
        setShipments(data);
      } catch (err) {
        setError('Failed to load shipments.');
        console.error('Admin shipping error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchShipments();
  }, []);

  const handleCreateShipment = async (e) => {
    e.preventDefault();
    try {
      const shipment = await createShipment(formData.orderNumber, {
        courier: formData.courier,
        trackingNumber: formData.trackingNumber,
      });
      setShipments((prev) => [shipment, ...prev]);
      setFormData({ orderNumber: '', courier: '', trackingNumber: '' });
      alert('Shipment created successfully.');
    } catch (err) {
      console.error(err);
      alert('Failed to create shipment.');
    }
  };

  const handleUpdateShipment = async (shipmentId, status) => {
    try {
      const updated = await updateShipment(shipmentId, { status });
      setShipments((prev) => prev.map((item) => (item._id === shipmentId ? updated : item)));
    } catch (err) {
      console.error(err);
      alert('Failed to update shipment.');
    }
  };

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="text-4xl font-bold text-slate-950 mb-4">Admin Access Required</h1>
        <p className="text-slate-600 mb-8">Sign in with the admin account to access shipping management.</p>
        <Link to="/auth/login" className="inline-flex items-center justify-center rounded-full bg-slate-950 px-8 py-4 text-sm font-semibold text-white transition hover:bg-slate-800">
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-950">Shipping Management</h1>
          <p className="mt-2 text-slate-600">Create shipments, track consignments, and sync delivery status.</p>
        </div>
        <Link
          to="/admin/orders"
          className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Back to Orders
        </Link>
      </div>

      {error && (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-rose-700 mb-6">{error}</div>
      )}

      <div className="grid gap-8 xl:grid-cols-[1fr_1.2fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-950 mb-4">Create Consignment</h2>
          <form onSubmit={handleCreateShipment} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-950 mb-2">Order Number</label>
              <input
                value={formData.orderNumber}
                onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                placeholder="Enter order number"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-950 mb-2">Courier</label>
              <input
                value={formData.courier}
                onChange={(e) => setFormData({ ...formData, courier: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                placeholder="Pathao, Steadfast, RedX"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-950 mb-2">Tracking Number</label>
              <input
                value={formData.trackingNumber}
                onChange={(e) => setFormData({ ...formData, trackingNumber: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                placeholder="Enter tracking number"
                required
              />
            </div>
            <button type="submit" className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
              Create Shipment
            </button>
          </form>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-950 mb-4">Shipment Status</h2>
          {loading ? (
            <div className="flex justify-center py-12"><Loader /></div>
          ) : shipments.length === 0 ? (
            <p className="text-sm text-slate-600">No shipments created yet.</p>
          ) : (
            <div className="space-y-4">
              {shipments.map((shipment) => (
                <div key={shipment._id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-slate-950">Order {shipment.orderNumber}</p>
                      <p className="text-sm text-slate-600">{shipment.courier} · {shipment.trackingNumber}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase text-slate-700">
                      {shipment.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {['picked', 'in_transit', 'out_for_delivery', 'delivered'].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleUpdateShipment(shipment._id, status)}
                        className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                      >
                        {status.replace(/_/g, ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
