import { useState, useRef, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  FiHeart, FiShoppingBag, FiUser, FiSearch, FiX,
  FiMenu, FiChevronDown, FiChevronRight,
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext.jsx';

// ── Mega Menu Data ────────────────────────────────────────────────────────────
const NAV_MENU = [
  {
    label: 'MEN',
    href: '/category/men',
    columns: [
      {
        heading: 'TOPWEAR',
        items: [
          { label: 'Half Sleeve T-Shirt', href: '/shop?category=men&sub=half-sleeve-tshirt' },
          { label: 'Full Sleeve T-Shirt', href: '/shop?category=men&sub=full-sleeve-tshirt' },
          { label: 'Polo T-Shirt', href: '/shop?category=men&sub=polo-tshirt' },
          { label: 'Hoodie', href: '/shop?category=men&sub=hoodie' },
          { label: 'Sweatshirt', href: '/shop?category=men&sub=sweatshirt' },
          { label: 'Jacket', href: '/shop?category=men&sub=jacket' },
          { label: 'Shirt', href: '/shop?category=men&sub=shirt' },
          { label: 'Panjabi', href: '/shop?category=men&sub=panjabi' },
        ],
      },
      {
        heading: 'BOTTOMWEAR',
        items: [
          { label: 'Cargo Pants', href: '/shop?category=men&sub=cargo-pants' },
          { label: 'Joggers', href: '/shop?category=men&sub=joggers' },
          { label: 'Jeans', href: '/shop?category=men&sub=jeans' },
          { label: 'Chino Pants', href: '/shop?category=men&sub=chino-pants' },
          { label: 'Shorts', href: '/shop?category=men&sub=shorts' },
          { label: 'Sports Trouser', href: '/shop?category=men&sub=sports-trouser' },
          { label: 'Comfy Trouser', href: '/shop?category=men&sub=comfy-trouser' },
          { label: 'Pajama', href: '/shop?category=men&sub=pajama' },
        ],
      },
      {
        heading: 'ACCESSORIES',
        items: [
          { label: 'Cap', href: '/shop?category=men&sub=cap' },
          { label: 'Belt', href: '/shop?category=men&sub=belt' },
          { label: 'Wallet', href: '/shop?category=men&sub=wallet' },
          { label: 'Socks', href: '/shop?category=men&sub=socks' },
          { label: 'Underwear', href: '/shop?category=men&sub=underwear' },
          { label: 'Face Mask', href: '/shop?category=men&sub=face-mask' },
        ],
      },
    ],
    viewAll: '/category/men',
  },
  {
    label: 'WOMEN',
    href: '/category/women',
    columns: [
      {
        heading: 'WESTERN & ETHNIC',
        items: [
          { label: 'Kurti & Tops', href: '/shop?category=women&sub=kurti-tops' },
          { label: 'T-Shirt', href: '/shop?category=women&sub=tshirt' },
          { label: 'Co-ords Set', href: '/shop?category=women&sub=coords' },
          { label: '3pc Salwar Kameez', href: '/shop?category=women&sub=3pc-salwar' },
          { label: '2pc Salwar Kameez', href: '/shop?category=women&sub=2pc-salwar' },
          { label: 'Kurti', href: '/shop?category=women&sub=kurti' },
          { label: 'Leggings', href: '/shop?category=women&sub=leggings' },
          { label: 'Palazzo', href: '/shop?category=women&sub=palazzo' },
        ],
      },
      {
        heading: 'BOTTOMWEAR',
        items: [
          { label: 'Comfy Trouser', href: '/shop?category=women&sub=comfy-trouser' },
          { label: 'Pajamas', href: '/shop?category=women&sub=pajamas' },
          { label: 'Shorts', href: '/shop?category=women&sub=shorts' },
          { label: 'Jeans', href: '/shop?category=women&sub=jeans' },
          { label: 'Skirt', href: '/shop?category=women&sub=skirt' },
        ],
      },
      {
        heading: 'ACCESSORIES',
        items: [
          { label: 'Hijab', href: '/shop?category=women&sub=hijab' },
          { label: 'Bag', href: '/shop?category=women&sub=bag' },
          { label: 'Jewellery', href: '/shop?category=women&sub=jewellery' },
          { label: 'Socks', href: '/shop?category=women&sub=socks' },
          { label: 'Cap', href: '/shop?category=women&sub=cap' },
        ],
      },
    ],
    viewAll: '/category/women',
  },
  {
    label: 'KIDS',
    href: '/category/kids',
    columns: [
      {
        heading: 'BOYS',
        items: [
          { label: 'T-Shirt', href: '/shop?category=kids&sub=boys-tshirt' },
          { label: 'Polo T-Shirt', href: '/shop?category=kids&sub=boys-polo' },
          { label: 'Full Sleeve T-Shirt', href: '/shop?category=kids&sub=boys-full-sleeve' },
          { label: 'Shorts', href: '/shop?category=kids&sub=boys-shorts' },
          { label: 'Panjabi', href: '/shop?category=kids&sub=boys-panjabi' },
          { label: 'Jacket', href: '/shop?category=kids&sub=boys-jacket' },
          { label: 'Trouser', href: '/shop?category=kids&sub=boys-trouser' },
          { label: 'Boys Combo Set', href: '/shop?category=kids&sub=boys-combo' },
        ],
      },
      {
        heading: 'GIRLS',
        items: [
          { label: 'T-Shirt', href: '/shop?category=kids&sub=girls-tshirt' },
          { label: 'Frock', href: '/shop?category=kids&sub=girls-frock' },
          { label: 'Shorts', href: '/shop?category=kids&sub=girls-shorts' },
          { label: 'Two Piece Set', href: '/shop?category=kids&sub=girls-2pc' },
          { label: 'Skirt', href: '/shop?category=kids&sub=girls-skirt' },
          { label: 'Hoodie', href: '/shop?category=kids&sub=girls-hoodie' },
          { label: 'Sweatshirt', href: '/shop?category=kids&sub=girls-sweatshirt' },
          { label: 'Girls Combo Set', href: '/shop?category=kids&sub=girls-combo' },
        ],
      },
    ],
    viewAll: '/category/kids',
  },
  {
    label: 'HOODIE',
    href: '/category/hoodie',
    columns: [
      {
        heading: 'HOODIE STYLES',
        items: [
          { label: 'Oversized Hoodie', href: '/shop?category=hoodie&sub=oversized' },
          { label: 'Zip-Up Hoodie', href: '/shop?category=hoodie&sub=zip-up' },
          { label: 'Pullover Hoodie', href: '/shop?category=hoodie&sub=pullover' },
          { label: 'Couple Hoodie', href: '/shop?category=hoodie&sub=couple' },
          { label: 'Graphic Hoodie', href: '/shop?category=hoodie&sub=graphic' },
        ],
      },
      {
        heading: 'BY GENDER',
        items: [
          { label: 'Men\'s Hoodie', href: '/shop?category=hoodie&gender=men' },
          { label: 'Women\'s Hoodie', href: '/shop?category=hoodie&gender=women' },
          { label: 'Kids Hoodie', href: '/shop?category=hoodie&gender=kids' },
          { label: 'Unisex Hoodie', href: '/shop?category=hoodie&gender=unisex' },
        ],
      },
    ],
    viewAll: '/category/hoodie',
  },
  {
    label: 'SHOES',
    href: '/category/shoes',
    columns: [
      {
        heading: 'MEN\'S FOOTWEAR',
        items: [
          { label: 'Sneakers', href: '/shop?category=shoes&sub=sneakers-men' },
          { label: 'Loafers', href: '/shop?category=shoes&sub=loafers' },
          { label: 'Formal Shoes', href: '/shop?category=shoes&sub=formal' },
          { label: 'Sports Shoes', href: '/shop?category=shoes&sub=sports-men' },
          { label: 'Sandals', href: '/shop?category=shoes&sub=sandals-men' },
        ],
      },
      {
        heading: 'WOMEN\'S FOOTWEAR',
        items: [
          { label: 'Sneakers', href: '/shop?category=shoes&sub=sneakers-women' },
          { label: 'Heels', href: '/shop?category=shoes&sub=heels' },
          { label: 'Flats', href: '/shop?category=shoes&sub=flats' },
          { label: 'Sandals', href: '/shop?category=shoes&sub=sandals-women' },
          { label: 'Sports Shoes', href: '/shop?category=shoes&sub=sports-women' },
        ],
      },
    ],
    viewAll: '/category/shoes',
  },
  {
    label: 'NEW ARRIVALS',
    href: '/shop?filter=new',
    columns: [],
    simple: true,
  },
];

// ── Mega Dropdown Component ───────────────────────────────────────────────────
function MegaDropdown({ menu, onClose }) {
  if (menu.simple || menu.columns.length === 0) return null;

  return (
    <div className="absolute inset-x-0 top-full z-50 border-t border-gray-100 bg-white shadow-2xl">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className={`grid gap-8 ${menu.columns.length === 3 ? 'grid-cols-4' : 'grid-cols-3'}`}>
          {menu.columns.map((col, ci) => (
            <div key={ci}>
              <h3 className="mb-4 text-xs font-bold tracking-[0.2em] text-gray-900 border-b border-gray-100 pb-2">
                {col.heading}
              </h3>
              <ul className="space-y-2">
                {col.items.map((item, ii) => (
                  <li key={ii}>
                    <Link
                      to={item.href}
                      onClick={onClose}
                      className="block text-sm text-gray-600 hover:text-black hover:font-medium transition-all"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Featured / New Arrivals Panel */}
          <div className="border-l border-gray-100 pl-8">
            <h3 className="mb-4 text-xs font-bold tracking-[0.2em] text-gray-900 border-b border-gray-100 pb-2">
              NEW ARRIVALS
            </h3>
            <div className="space-y-4">
              <Link
                to={`${menu.href}?filter=new`}
                onClick={onClose}
                className="group block overflow-hidden rounded-lg"
              >
                <div className="aspect-[3/4] overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={`https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=300&q=80`}
                    alt="New Arrivals"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <p className="mt-2 text-xs font-semibold text-gray-800">Shop New Arrivals</p>
                <p className="text-xs text-gray-500">Starting from ৳650</p>
              </Link>
            </div>
            <Link
              to={menu.viewAll}
              onClick={onClose}
              className="mt-6 flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-black hover:gap-2 transition-all"
            >
              View All {menu.label} <FiChevronRight size={12} />
            </Link>
          </div>
        </div>

        {/* View All Footer */}
        <div className="mt-6 border-t border-gray-100 pt-4">
          <Link
            to={menu.viewAll}
            onClick={onClose}
            className="flex items-center gap-1 text-sm font-semibold text-black hover:underline"
          >
            View All {menu.label} <FiChevronRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Main Navbar ───────────────────────────────────────────────────────────────
export default function Navbar() {
  const { user, logout } = useAuth();
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveMenu(null);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 100);
    }
  }, [searchOpen]);

  const closeDropdown = () => setActiveMenu(null);

  return (
    <>
      {/* ── Announcement Bar ─────────────────────────────── */}
      <div className="bg-black py-2 text-center text-xs text-white">
        🎉 Free delivery on orders above ৳1500! &nbsp;
        <Link to="/shop" className="underline font-semibold hover:text-yellow-300 transition">
          Shop Now →
        </Link>
      </div>

      {/* ── Top Quick Links Bar — transparent ───────────── */}
      <div className="hidden border-b border-gray-200/60 bg-transparent lg:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-1.5">
          <div className="flex items-center gap-6">
            {['MEN', 'WOMEN', 'KIDS', 'NEW ARRIVALS'].map((label) => (
              <Link
                key={label}
                to={`/shop?section=${label.toLowerCase().replace(' ', '-')}`}
                className="text-[11px] font-semibold tracking-widest text-gray-500 hover:text-black transition"
              >
                {label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-4 text-[11px] text-gray-500">
            <span className="font-semibold text-gray-600">GET 5% OFF ON APP</span>
            <a href="#" className="rounded bg-black px-2 py-1 text-[10px] text-white font-medium hover:bg-gray-800 transition">App Store</a>
            <a href="#" className="rounded bg-black px-2 py-1 text-[10px] text-white font-medium hover:bg-gray-800 transition">Google Play</a>
          </div>
        </div>
      </div>

      {/* ── Main Header ─────────────────────────────────── */}
      <header ref={navRef} className="sticky top-0 z-50 border-b border-gray-200 bg-white">

        {/* ── Search Overlay ─────────────── */}
        {searchOpen && (
          <div className="absolute inset-x-0 top-0 z-50 flex items-center bg-white px-6 py-3 shadow-md">
            <FiSearch className="mr-3 text-gray-400" size={20} />
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products, brands, categories..."
              className="flex-1 w-full py-3 text-base outline-none placeholder-gray-400"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  window.location.href = `/shop?q=${encodeURIComponent(searchQuery.trim())}`;
                }
                if (e.key === 'Escape') setSearchOpen(false);
              }}
            />
            <button
              onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
              className="ml-3 rounded-full p-2 hover:bg-gray-100 transition"
            >
              <FiX size={20} />
            </button>
          </div>
        )}

        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">

          {/* Logo */}
          <NavLink to="/" className="text-xl font-black tracking-[0.1em] text-black">
            VELOURA
          </NavLink>

          {/* ── Desktop Nav ─────────────── */}
          <div className="relative hidden lg:block" onMouseLeave={() => setActiveMenu(null)}>
            <nav className="flex items-center gap-1">
              {NAV_MENU.map((menu) => (
                <div
                  key={menu.label}
                  onMouseEnter={() => !menu.simple && setActiveMenu(menu.label)}
                >
                  <Link
                    to={menu.href}
                    className={`flex items-center gap-1 rounded px-3 py-2 text-[13px] font-semibold tracking-wide transition ${
                      activeMenu === menu.label ? 'text-black' : 'text-gray-700 hover:text-black'
                    }`}
                    onClick={closeDropdown}
                  >
                    {menu.label}
                    {!menu.simple && (
                      <FiChevronDown
                        size={13}
                        className={`transition-transform duration-200 ${activeMenu === menu.label ? 'rotate-180' : ''}`}
                      />
                    )}
                  </Link>
                </div>
              ))}
            </nav>

            {activeMenu && (
              <MegaDropdown
                menu={NAV_MENU.find((menu) => menu.label === activeMenu)}
                onClose={closeDropdown}
              />
            )}
          </div>

          {/* ── Right Icons ─────────────── */}
          <div className="flex items-center gap-1 text-gray-700">
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden rounded-full p-2.5 hover:bg-gray-100 transition md:flex"
              aria-label="Search"
            >
              <FiSearch size={19} />
            </button>

            <NavLink
              to="/wishlist"
              className="rounded-full p-2.5 hover:bg-gray-100 transition"
              aria-label="Wishlist"
            >
              <FiHeart size={19} />
            </NavLink>

            <NavLink
              to="/cart"
              className="relative rounded-full p-2.5 hover:bg-gray-100 transition"
              aria-label="Cart"
            >
              <FiShoppingBag size={19} />
            </NavLink>

            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-1.5 rounded-full border border-gray-300 px-3 py-1.5 text-xs font-medium hover:border-black transition">
                  <FiUser size={14} />
                  {user.name?.split(' ')[0]}
                </button>
                <div className="absolute right-0 top-full hidden w-44 rounded-xl border border-gray-100 bg-white py-2 shadow-xl group-hover:block">
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Profile</Link>
                  <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Orders</Link>
                  <Link to="/wishlist" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Wishlist</Link>
                  <hr className="my-1 border-gray-100" />
                  <button onClick={logout} className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-gray-50">
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <NavLink
                to="/auth/login"
                className="ml-1 rounded-full border border-gray-300 px-4 py-1.5 text-xs font-semibold tracking-wide hover:border-black hover:bg-black hover:text-white transition"
              >
                Sign In
              </NavLink>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="ml-1 rounded-full p-2.5 hover:bg-gray-100 transition lg:hidden"
            >
              {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ─────────────────────────────────── */}
        {mobileOpen && (
          <div className="border-t border-gray-100 bg-white lg:hidden max-h-[80vh] overflow-y-auto">
            <div className="flex items-center border-b border-gray-100 px-4 py-3">
              <FiSearch className="mr-3 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search products..."
                className="flex-1 w-full text-sm outline-none placeholder-gray-400"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    window.location.href = `/shop?q=${encodeURIComponent(e.target.value.trim())}`;
                    setMobileOpen(false);
                  }
                }}
              />
            </div>

            {NAV_MENU.map((menu) => (
              <div key={menu.label} className="border-b border-gray-50">
                {menu.simple || menu.columns.length === 0 ? (
                  <Link
                    to={menu.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-5 py-4 text-sm font-semibold text-gray-800"
                  >
                    {menu.label}
                  </Link>
                ) : (
                  <>
                    <button
                      onClick={() =>
                        setMobileExpanded(mobileExpanded === menu.label ? null : menu.label)
                      }
                      className="flex w-full items-center justify-between px-5 py-4 text-sm font-semibold text-gray-800"
                    >
                      {menu.label}
                      <FiChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${mobileExpanded === menu.label ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {mobileExpanded === menu.label && (
                      <div className="bg-gray-50 px-5 pb-4">
                        {menu.columns.map((col, ci) => (
                          <div key={ci} className="mt-4">
                            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                              {col.heading}
                            </p>
                            <div className="grid grid-cols-2 gap-1">
                              {col.items.map((item, ii) => (
                                <Link
                                  key={ii}
                                  to={item.href}
                                  onClick={() => { setMobileOpen(false); setMobileExpanded(null); }}
                                  className="rounded py-1.5 text-sm text-gray-600 hover:text-black"
                                >
                                  {item.label}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                        <Link
                          to={menu.viewAll}
                          onClick={() => { setMobileOpen(false); setMobileExpanded(null); }}
                          className="mt-4 flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-black"
                        >
                          View All {menu.label} <FiChevronRight size={11} />
                        </Link>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}

            <div className="border-t border-gray-100 px-5 py-4">
              {user ? (
                <div className="space-y-2">
                  <Link to="/profile" onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-gray-700">My Profile</Link>
                  <Link to="/orders" onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-gray-700">My Orders</Link>
                  <button onClick={() => { logout(); setMobileOpen(false); }} className="block py-2 text-sm text-red-500">
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-full bg-black px-6 py-3 text-center text-sm font-semibold text-white"
                >
                  Sign In / Register
                </Link>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}