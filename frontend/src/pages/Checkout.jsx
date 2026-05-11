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
    paymentMethod: 'cod', // cod, bkash, card
    bkashNumber: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    cardHolderName: '',
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

    // Validate payment method specific fields
    if (formData.paymentMethod === 'bkash' && !formData.bkashNumber) {
      alert('Please enter your bKash number');
      setLoading(false);
      return;
    }

    if (formData.paymentMethod === 'card') {
      if (!formData.cardNumber || !formData.cardExpiry || !formData.cardCvv || !formData.cardHolderName) {
        alert('Please fill in all card details');
        setLoading(false);
        return;
      }
    }

    // Simulate order processing
    try {
      // Here you would integrate with your payment processor and backend
      const orderData = {
        ...formData,
        items,
        subtotal,
        shipping,
        total,
        orderDate: new Date().toISOString(),
      };

      console.log('Order data:', orderData);

      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call

      // Clear cart and redirect to success page
      dispatch(clearCart());
      navigate('/order-success');
    } catch (error) {
      console.error('Order processing failed:', error);
      alert('Order processing failed. Please try again.');
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
            <div className="space-y-6 rounded-3xl bg-slate-50 p-6">
              <h2 className="text-xl font-semibold text-slate-950">Payment Method</h2>

              {/* Payment Method Selection */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 cursor-pointer hover:border-gold transition">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-gold focus:ring-gold"
                  />
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded bg-green-100 flex items-center justify-center">
                      <span className="text-green-600 text-sm font-bold">৳</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-950">Cash on Delivery (COD)</span>
                      <p className="text-xs text-slate-600">Pay cash when your order is delivered</p>
                    </div>
                  </div>
                </label>

                <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 cursor-pointer hover:border-gold transition">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bkash"
                    checked={formData.paymentMethod === 'bkash'}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-gold focus:ring-gold"
                  />
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded bg-pink-100 flex items-center justify-center">
                      <span className="text-pink-600 text-xs font-bold">bKash</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-950">bKash</span>
                      <p className="text-xs text-slate-600">Pay with bKash mobile banking</p>
                    </div>
                  </div>
                </label>

                <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 cursor-pointer hover:border-gold transition">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-gold focus:ring-gold"
                  />
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 text-lg">💳</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-950">Credit/Debit Card</span>
                      <p className="text-xs text-slate-600">Visa, MasterCard, American Express</p>
                    </div>
                  </div>
                </label>
              </div>

              {/* Conditional Payment Fields */}
              {formData.paymentMethod === 'bkash' && (
                <div className="space-y-4 pt-4 border-t border-slate-200">
                  <h3 className="text-lg font-medium text-slate-950">bKash Information</h3>
                  <Input
                    label="bKash Account Number"
                    name="bkashNumber"
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    value={formData.bkashNumber}
                    onChange={handleInputChange}
                    required={formData.paymentMethod === 'bkash'}
                  />
                  <div className="rounded-2xl bg-blue-50 p-4 text-sm text-blue-800">
                    <p className="font-medium mb-2">How to pay with bKash:</p>
                    <ol className="list-decimal list-inside space-y-1 text-xs">
                      <li>Go to your bKash app</li>
                      <li>Select "Send Money"</li>
                      <li>Enter our merchant number: 017XXXXXXXX</li>
                      <li>Enter the order amount</li>
                      <li>Complete the payment</li>
                      <li>Send us the transaction ID</li>
                    </ol>
                  </div>
                </div>
              )}

              {formData.paymentMethod === 'card' && (
                <div className="space-y-4 pt-4 border-t border-slate-200">
                  <h3 className="text-lg font-medium text-slate-950">Card Information</h3>
                  <Input
                    label="Card Number"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    required={formData.paymentMethod === 'card'}
                  />
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input
                      label="Expiry Date"
                      name="cardExpiry"
                      placeholder="MM/YY"
                      value={formData.cardExpiry}
                      onChange={handleInputChange}
                      required={formData.paymentMethod === 'card'}
                    />
                    <Input
                      label="CVV"
                      name="cardCvv"
                      placeholder="123"
                      value={formData.cardCvv}
                      onChange={handleInputChange}
                      required={formData.paymentMethod === 'card'}
                    />
                  </div>
                  <Input
                    label="Cardholder Name"
                    name="cardHolderName"
                    placeholder="John Doe"
                    value={formData.cardHolderName}
                    onChange={handleInputChange}
                    required={formData.paymentMethod === 'card'}
                  />
                  <div className="rounded-2xl bg-yellow-50 p-4 text-sm text-yellow-800">
                    <p className="font-medium mb-2">🔒 Secure Payment</p>
                    <p className="text-xs">Your card information is encrypted and secure. We use SSL encryption for all transactions.</p>
                  </div>
                </div>
              )}

              {formData.paymentMethod === 'cod' && (
                <div className="rounded-2xl bg-green-50 p-4 text-sm text-green-800">
                  <p className="font-medium mb-2">✅ Cash on Delivery</p>
                  <p className="text-xs">Pay in cash when your order is delivered to your doorstep. No advance payment required!</p>
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Processing Order...' :
               formData.paymentMethod === 'cod' ? 'Place Order (Cash on Delivery)' :
               formData.paymentMethod === 'bkash' ? 'Pay with bKash' :
               'Pay with Card'}
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
              <div className="flex justify-between border-t border-slate-200 pt-3 text-slate-600">
                <span>Payment Method</span>
                <span className="capitalize font-medium">
                  {formData.paymentMethod === 'cod' ? 'Cash on Delivery' :
                   formData.paymentMethod === 'bkash' ? 'bKash' : 'Card'}
                </span>
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
