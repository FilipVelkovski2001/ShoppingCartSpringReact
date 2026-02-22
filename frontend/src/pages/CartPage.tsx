import React from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartPage(): React.JSX.Element {
  const { cart, loading, updateQuantity, removeItem, clearCart } = useCart();

  const handleUpdate = async (productId: number, quantity: number): Promise<void> => {
    try { await updateQuantity(productId, quantity); }
    catch { toast.error('Could not update quantity'); }
  };

  const handleRemove = async (productId: number, title: string): Promise<void> => {
    try {
      await removeItem(productId);
      toast.success(`${title} removed`);
    } catch { toast.error('Could not remove item'); }
  };

  const handleClear = async (): Promise<void> => {
    try {
      await clearCart();
      toast.success('Cart cleared');
    } catch { toast.error('Could not clear cart'); }
  };

  if (loading) return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map(i => <div key={i} className="h-24 bg-white rounded-2xl shadow-soft" />)}
      </div>
    </div>
  );

  if (cart.items.length === 0) return (
    <div className="max-w-4xl mx-auto px-6 py-24 text-center">
      <div className="w-20 h-20 bg-cream-200 rounded-full flex items-center justify-center mx-auto mb-6">
        <ShoppingBag size={32} className="text-stone-300" />
      </div>
      <h2 className="font-display text-3xl text-stone-700 mb-2">Your cart is empty</h2>
      <p className="text-stone-400 font-light mb-8">Add some products to get started</p>
      <Link
        to="/products"
        className="inline-flex items-center gap-2 px-6 py-3 bg-brand-700 text-cream-50 rounded-xl text-sm font-medium hover:bg-brand-800 transition-colors"
      >
        Browse Products <ArrowRight size={15} />
      </Link>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-8 py-10">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl text-stone-800">Your Cart</h1>
          <p className="text-stone-400 font-light text-sm mt-1">{cart.totalItems} items</p>
        </div>
        <button
          onClick={handleClear}
          className="text-xs text-stone-400 hover:text-rose-400 transition-colors flex items-center gap-1.5"
        >
          <Trash2 size={13} /> Clear all
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {cart.items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-4 shadow-soft border border-cream-200 flex gap-4">
              <div className="w-20 h-20 bg-cream-100 rounded-xl overflow-hidden flex-shrink-0">
                <img src={item.productThumbnail} alt={item.productTitle} className="w-full h-full object-cover" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-stone-800 truncate mb-1">{item.productTitle}</h3>
                <p className="font-display text-base text-brand-700 mb-3">${item.productPrice.toFixed(2)}</p>

                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-cream-100 rounded-lg overflow-hidden">
                    <button
                      onClick={() => handleUpdate(item.productId, item.quantity - 1)}
                      className="px-2.5 py-1.5 text-stone-400 hover:text-stone-700 hover:bg-cream-200 transition-colors"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="px-3 text-sm font-medium text-stone-700">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdate(item.productId, item.quantity + 1)}
                      className="px-2.5 py-1.5 text-stone-400 hover:text-stone-700 hover:bg-cream-200 transition-colors"
                    >
                      <Plus size={13} />
                    </button>
                  </div>

                  <button
                    onClick={() => handleRemove(item.productId, item.productTitle)}
                    className="text-stone-300 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <p className="font-display text-lg text-stone-800">${item.subtotal.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-card border border-cream-200 sticky top-20">
            <h2 className="font-display text-xl text-stone-800 mb-5">Order Summary</h2>

            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-sm">
                <span className="text-stone-400 font-light">Subtotal ({cart.totalItems} items)</span>
                <span className="text-stone-700">${cart.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-400 font-light">Shipping</span>
                <span className="text-emerald-600 font-medium">Free</span>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-cream-200 mb-6">
              <span className="font-medium text-stone-800">Total</span>
              <span className="font-display text-2xl text-stone-800">${cart.total.toFixed(2)}</span>
            </div>

            <button className="w-full py-3.5 bg-brand-700 text-cream-50 text-sm font-medium rounded-xl hover:bg-brand-800 transition-colors flex items-center justify-center gap-2">
              Checkout <ArrowRight size={15} />
            </button>

            <Link
              to="/products"
              className="block text-center text-xs text-stone-400 hover:text-stone-600 mt-4 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
