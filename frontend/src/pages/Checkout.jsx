import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../redux/slices/cartSlice.js';
import { formatPrice } from '../utils/formatPrice.js';
import Input from '../components/common/Input.jsx';
import Button from '../components/common/Button.jsx';

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector((state) => state.cart.items);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 50; // Free shipping over $500
  const total = subtotal + shipping;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Bangladesh',
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate order processing
    try {
      // Here you would integrate with your payment processor and backend
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call

      // Clear cart and redirect to success page
      dispatch(clearCart());
      navigate('/order-success');
    } catch (error) {
      console.error('Order processing failed:', error);
      // Handle error (show toast, etc.)
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h1 className="text-4xl font-bold text-slate-950 mb-4">Your cart is empty</h1>
        <p className="text-slate-600 mb-8">Add some products to your cart before checking out.</p>
        <Button onClick={() => navigate('/shop')}>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <section className="space-y-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Checkout</p>
            <h1 className="mt-3 text-4xl font-bold text-slate-950">Shipping & payment</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Shipping Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-slate-950">Shipping Information</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <Input
                  label="First Name"
                  name="firstName"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Last Name"
                  name="lastName"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-6">
                <Input
                  label="Address"
                  name="address"
                  placeholder="Street address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
                <div className="grid gap-6 md:grid-cols-3">
                  <Input
                    label="City"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    label="State/Province"
                    name="state"
                    placeholder="State or Province"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    label="ZIP Code"
                    name="zipCode"
                    placeholder="ZIP or Postal Code"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <Input
                  label="Country"
                  name="country"
                  placeholder="Country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Payment Information */}
            <div className="space-y-4 rounded-3xl bg-slate-50 p-6">
              <h2 className="text-xl font-semibold text-slate-950">Payment Information</h2>
              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded bg-slate-100"></div>
                    <span className="text-sm text-slate-600">Cash on Delivery</span>
                  </div>
                </div>
                <p className="text-sm text-slate-600">
                  Pay with cash when your order is delivered to your door.
                  <br />
                  <span className="font-medium">Note:</span> Online payment integration will be available soon.
                </p>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Processing Order...' : 'Place Order'}
            </Button>
          </form>
        </section>

        <aside className="space-y-6">
          {/* Order Summary */}
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Order summary</p>
              <p className="mt-3 text-2xl font-semibold text-slate-950">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </p>
            </div>

            <div className="mt-6 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 rounded-2xl object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-slate-950">{item.name}</h3>
                    <p className="text-sm text-slate-600">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-medium text-slate-950">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3 rounded-3xl bg-slate-50 p-6 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
              </div>
              {subtotal < 500 && (
                <p className="text-xs text-slate-500">
                  Add {formatPrice(500 - subtotal)} more for free shipping
                </p>
              )}
              <div className="flex justify-between border-t border-slate-200 pt-3 font-semibold text-slate-950">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>

          {/* Back to Cart */}
          <button
            onClick={() => navigate('/cart')}
            className="w-full rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
          >
            ← Back to Cart
          </button>
        </aside>
      </div>
    </div>
  );
}
