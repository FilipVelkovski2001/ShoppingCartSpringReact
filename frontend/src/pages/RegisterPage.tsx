import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Package2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { Register } from '../dto';

export default function RegisterPage(): React.JSX.Element {
  const [form, setForm] = useState<Register>({
    username: '', email: '', password: '', firstName: '', lastName: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created successfully');
      navigate('/products');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  type FormKey = keyof Register;

  const field = (
    key: FormKey,
    label: string,
    type: string = 'text',
    placeholder: string = ''
  ): React.JSX.Element => (
    <div>
      <label className="block text-xs font-medium text-stone-500 uppercase tracking-widest mb-2">
        {label}
      </label>
      <input
        type={type}
        value={form[key] ?? ''}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className="w-full px-4 py-3 bg-white border border-cream-200 rounded-xl text-stone-800 placeholder-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-transparent transition shadow-soft"
        placeholder={placeholder}
        required={['username', 'email', 'password'].includes(key)}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2.5 mb-10 justify-center">
          <div className="w-9 h-9 bg-brand-700 rounded-lg flex items-center justify-center">
            <Package2 size={18} className="text-cream-50" />
          </div>
          <span className="font-display text-xl text-stone-800">Abysalto</span>
        </div>

        <div className="bg-white rounded-3xl shadow-card p-10">
          <h2 className="font-display text-3xl text-stone-800 mb-1">Create account</h2>
          <p className="text-stone-400 text-sm mb-8 font-light">Join us and start shopping</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              {field('firstName', 'First Name', 'text', 'Jane')}
              {field('lastName', 'Last Name', 'text', 'Doe')}
            </div>
            {field('username', 'Username', 'text', 'janedoe')}
            {field('email', 'Email', 'email', 'jane@example.com')}
            {field('password', 'Password', 'password', '6+ characters')}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-brand-700 text-cream-50 text-sm font-medium rounded-xl hover:bg-brand-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 tracking-wide mt-2"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-stone-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 hover:text-brand-800 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
