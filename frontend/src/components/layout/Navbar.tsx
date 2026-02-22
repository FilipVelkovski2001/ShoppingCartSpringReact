import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Package2, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function Navbar(): React.JSX.Element {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const handleLogout = (): void => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string): boolean => location.pathname === path;

  const navLink = (to: string, label: string): React.JSX.Element => (
    <Link
      to={to}
      className={`text-sm font-medium tracking-wide transition-colors duration-200 ${
        isActive(to) ? 'text-brand-700' : 'text-stone-500 hover:text-stone-800'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cream-50/90 backdrop-blur-md border-b border-cream-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/products" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-brand-700 rounded-lg flex items-center justify-center">
              <Package2 size={16} className="text-cream-50" />
            </div>
            <span className="font-display text-lg text-stone-800 tracking-wide">Abysalto</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLink('/products', 'Products')}
            {navLink('/profile', 'Profile')}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <span className="hidden md:block text-sm text-stone-400 font-light">
              Hello, <span className="text-stone-600 font-medium">{user?.firstName ?? user?.username}</span>
            </span>

            <Link to="/cart" className="relative p-2 text-stone-500 hover:text-stone-800 transition-colors">
              <ShoppingBag size={20} />
              {cart.totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand-600 text-cream-50 text-[10px] font-semibold rounded-full h-4 w-4 flex items-center justify-center leading-none">
                  {cart.totalItems > 9 ? '9+' : cart.totalItems}
                </span>
              )}
            </Link>

            <button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-1.5 text-sm text-stone-400 hover:text-rose-500 transition-colors"
            >
              <LogOut size={15} />
            </button>

            <button
              className="md:hidden p-1.5 text-stone-500"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-cream-200 bg-cream-50 px-6 py-4 space-y-4">
          <Link to="/products" className="block text-sm text-stone-600" onClick={() => setMenuOpen(false)}>Products</Link>
          <Link to="/profile" className="block text-sm text-stone-600" onClick={() => setMenuOpen(false)}>Profile</Link>
          <Link to="/cart" className="block text-sm text-stone-600" onClick={() => setMenuOpen(false)}>
            Cart {cart.totalItems > 0 && `(${cart.totalItems})`}
          </Link>
          <button onClick={handleLogout} className="block text-sm text-rose-400">Sign out</button>
        </div>
      )}
    </nav>
  );
}
