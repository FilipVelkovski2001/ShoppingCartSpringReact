import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { User, Heart, Mail, AtSign, Star, Trash2, ShoppingBag } from 'lucide-react';
import { userApi, productApi } from '../api';
import { useCart } from '../context/CartContext';
import type { UserDto, ProductDto } from '../dto';

export default function ProfilePage(): React.JSX.Element {
  const [userData, setUserData]             = useState<UserDto | null>(null);
  const [favoriteProducts, setFavoriteProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading]               = useState<boolean>(true);
  const { addItem } = useCart();

  useEffect(() => {
    const load = async (): Promise<void> => {
      try {
        const { data } = await userApi.getMe();
        setUserData(data.data);
        const ids: number[] = data.data?.favoriteProductIds ?? [];
        if (ids.length > 0) {
          const results = await Promise.all(ids.map(id => productApi.getById(id)));
          setFavoriteProducts(results.map(r => r.data.data));
        }
      } catch {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleRemoveFavorite = async (productId: number): Promise<void> => {
    try {
      await userApi.removeFavorite(productId);
      setFavoriteProducts(prev => prev.filter(p => p.id !== productId));
      toast.success('Removed from favorites');
    } catch {
      toast.error('Could not remove favorite');
    }
  };

  const handleAddToCart = async (product: ProductDto): Promise<void> => {
    try {
      await addItem(product);
      toast.success(`${product.title} added to cart`);
    } catch {
      toast.error('Could not add to cart');
    }
  };

  if (loading) return (
    <div className="max-w-4xl mx-auto px-6 py-10 animate-pulse space-y-5">
      <div className="h-40 bg-white rounded-3xl shadow-soft" />
      <div className="h-64 bg-white rounded-3xl shadow-soft" />
    </div>
  );

  const displayName = userData?.firstName && userData?.lastName
    ? `${userData.firstName} ${userData.lastName}`
    : userData?.username;

  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-8 py-10 space-y-6">
      {/* Profile card */}
      <div className="bg-white rounded-3xl shadow-soft border border-cream-200 p-8">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-brand-100 rounded-2xl flex items-center justify-center flex-shrink-0">
            <User size={32} className="text-brand-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-3xl text-stone-800 mb-1">{displayName}</h1>
            <div className="flex flex-col gap-1 mt-2">
              <div className="flex items-center gap-2 text-stone-400">
                <AtSign size={13} />
                <span className="text-sm font-light">{userData?.username}</span>
              </div>
              <div className="flex items-center gap-2 text-stone-400">
                <Mail size={13} />
                <span className="text-sm font-light">{userData?.email}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-cream-200">
          <div className="text-center p-4 bg-cream-50 rounded-2xl">
            <p className="font-display text-3xl text-brand-700 mb-1">{favoriteProducts.length}</p>
            <p className="text-xs text-stone-400 uppercase tracking-widest font-medium">Favorites</p>
          </div>
          <div className="text-center p-4 bg-cream-50 rounded-2xl">
            <p className="font-display text-3xl text-brand-700 mb-1">{userData?.favoriteProductIds?.length ?? 0}</p>
            <p className="text-xs text-stone-400 uppercase tracking-widest font-medium">Saved Items</p>
          </div>
        </div>
      </div>

      {/* Favorites */}
      <div className="bg-white rounded-3xl shadow-soft border border-cream-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <Heart size={18} className="fill-rose-400 text-rose-400" />
            <h2 className="font-display text-2xl text-stone-800">Favorites</h2>
          </div>
          <span className="text-xs text-stone-400 font-light">{favoriteProducts.length} saved</span>
        </div>

        {favoriteProducts.length === 0 ? (
          <div className="text-center py-12">
            <Heart size={36} className="mx-auto mb-3 text-cream-200" />
            <p className="text-stone-400 font-light text-sm mb-4">Nothing saved yet</p>
            <Link to="/products" className="text-xs text-brand-600 hover:text-brand-800 underline underline-offset-2 transition-colors">
              Browse products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {favoriteProducts.map((product) => (
              <div key={product.id} className="flex gap-3 p-3.5 border border-cream-200 rounded-2xl hover:border-brand-200 hover:shadow-soft transition-all">
                <div className="w-16 h-16 bg-cream-100 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                  <Link
                    to={`/products/${product.id}`}
                    className="text-sm font-medium text-stone-800 hover:text-brand-700 transition-colors truncate block"
                  >
                    {product.title}
                  </Link>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star size={11} className="fill-amber-400 text-amber-400" />
                    <span className="text-xs text-stone-400">{product.rating}</span>
                  </div>
                  <p className="font-display text-base text-stone-800 mt-1">${product.price}</p>
                </div>

                <div className="flex flex-col gap-1.5 justify-center">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-8 h-8 flex items-center justify-center text-stone-300 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                  >
                    <ShoppingBag size={14} />
                  </button>
                  <button
                    onClick={() => handleRemoveFavorite(product.id)}
                    className="w-8 h-8 flex items-center justify-center text-stone-300 hover:text-rose-400 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
