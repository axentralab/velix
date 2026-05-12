import { AnimatePresence } from 'framer-motion';
import { Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import AuthLayout from './layouts/AuthLayout.jsx';
import Home from './pages/Home.jsx';
import { ProductProvider } from './contexts/ProductContext.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import Shop from './pages/Shop.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import Category from './pages/Category.jsx';
import Wishlist from './pages/Wishlist.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import OrderSuccess from './pages/OrderSuccess.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Profile from './pages/Profile.jsx';
import OrderHistory from './pages/OrderHistory.jsx';
import OrderDetails from './pages/OrderDetails.jsx';
import AdminOrders from './pages/AdminOrders.jsx';
import Contact from './pages/Contact.jsx';
import Privacy from './pages/Privacy.jsx';
import Terms from './pages/Terms.jsx';

function NotFound() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-24 text-center">
      <p className="text-sm uppercase tracking-[0.35em] text-gray-400">Page not found</p>
      <h1 className="mt-5 text-4xl font-black text-slate-900">404 — Sorry, we can’t find that page.</h1>
      <p className="mt-4 text-sm text-slate-600">The link may be invalid or the page has been moved.</p>
      <a href="/" className="mt-8 inline-block rounded-full bg-slate-950 px-8 py-3 text-sm font-semibold text-white transition hover:bg-black">
        Return to home
      </a>
    </div>
  );
}

function App() {
  return (
    <AnimatePresence mode="wait">
      <AuthProvider>
        <ProductProvider>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="shop" element={<Shop />} />
              <Route path="product/:id" element={<ProductDetails />} />
              <Route path="category/:slug" element={<Category />} />
              <Route path="wishlist" element={<Wishlist />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="order-success" element={<OrderSuccess />} />
              <Route path="contact" element={<Contact />} />
              <Route path="privacy" element={<Privacy />} />
              <Route path="terms" element={<Terms />} />
              <Route path="profile" element={<Profile />} />
              <Route path="orders" element={<OrderHistory />} />
              <Route path="orders/:orderNumber" element={<OrderDetails />} />
              <Route path="admin/orders" element={<AdminOrders />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route path="/auth" element={<AuthLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>
          </Routes>
        </ProductProvider>
      </AuthProvider>
    </AnimatePresence>
  );
}

export default App;
