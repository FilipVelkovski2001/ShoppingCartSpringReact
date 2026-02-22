import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Package2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { Login } from '../dto';

export default function LoginPage(): React.JSX.Element {
  const [form, setForm] = useState<Login>({ username: '', password: '' });
  const [loading, setLoading] = useState<boolean>(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form);
      toast.success('Welcome back');
      navigate('/products');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid credentials';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-100 flex">
      <div id={'leftDecorativePanel'} className="hidden lg:flex lg:w-1/2 bg-brand-800 flex-col justify-between p-14">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-brand-600 rounded-lg flex items-center justify-center">
            <Package2 size={18} className="text-cream-50" />
          </div>
          <span className="font-display text-xl text-cream-100 tracking-wide">Abysalto</span>
        </div>
        <div>
          <h1 className="font-display text-5xl text-cream-50 leading-tight mb-6">
            Discover products you'll love.
          </h1>
          <p className="text-brand-300 text-lg font-light leading-relaxed">
            A curated shopping experience built with care and attention to detail.
          </p>
        </div>
        <p className="text-brand-500 text-sm">© 2025 Abysalto</p>
      </div>

      <div id={'rightFormPanel'} className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2.5 mb-10 lg:hidden">
            <div className="w-8 h-8 bg-brand-700 rounded-lg flex items-center justify-center">
              <Package2 size={16} className="text-cream-50" />
            </div>
            <span className="font-display text-lg text-stone-800">Abysalto</span>
          </div>

          <h2 className="font-display text-3xl text-stone-800 mb-1">Sign in</h2>
          <p className="text-stone-400 text-sm mb-8 font-light">Welcome back to your account</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-stone-500 uppercase tracking-widest mb-2">
                Username
              </label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-cream-200 rounded-xl text-stone-800 placeholder-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-transparent transition shadow-soft"
                placeholder="your username"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-500 uppercase tracking-widest mb-2">
                Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-cream-200 rounded-xl text-stone-800 placeholder-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-transparent transition shadow-soft"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-brand-700 text-cream-50 text-sm font-medium rounded-xl hover:bg-brand-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 tracking-wide"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-stone-400 mt-8">
            New here?{' '}
            <Link to="/register" className="text-brand-600 hover:text-brand-800 font-medium transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
