import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowLeft, Star, ShoppingBag, Heart, Truck, Shield, RotateCcw } from 'lucide-react';
import { productApi, userApi } from '../api';
import { useCart } from '../context/CartContext';
import type { ProductDto } from '../dto';

export default function ProductDetailPage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct]             = useState<ProductDto | null>(null);
  const [loading, setLoading]             = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [quantity, setQuantity]           = useState<number>(1);
  const [isFavorite, setIsFavorite]       = useState<boolean>(false);
  const { addItem } = useCart();

  useEffect(() => {
    const load = async (): Promise<void> => {
      try {
        const [{ data: productData }, { data: userData }] = await Promise.all([
          productApi.getById(Number(id)),
          userApi.getMe(),
        ]);
        setProduct(productData.data);
        setIsFavorite(userData.data?.favoriteProductIds?.includes(Number(id)) ?? false);
      } catch {
        toast.error('Product not found');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  const handleAddToCart = async (): Promise<void> => {
    if (!product) return;
    try {
      await addItem(product, quantity);
      toast.success(`${quantity}× ${product.title} added`);
    } catch {
      toast.error('Could not add to cart');
    }
  };

  const handleToggleFavorite = async (): Promise<void> => {
    if (!product) return;
    try {
      if (isFavorite) {
        await userApi.removeFavorite(product.id);
        setIsFavorite(false);
      } else {
        await userApi.addFavorite(product.id);
        setIsFavorite(true);
      }
    } catch {
      toast.error('Could not update favorites');
    }
  };

  if (loading) return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-white rounded-3xl h-96 shadow-soft" />
        <div className="space-y-5">
          <div className="h-6 bg-cream-200 rounded w-1/3" />
          <div className="h-9 bg-cream-200 rounded w-3/4" />
          <div className="h-20 bg-cream-200 rounded" />
        </div>
      </div>
    </div>
  );

  if (!product) return <></>;

  const images: string[] = product.images?.length > 0 ? product.images : [product.thumbnail];

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-8 py-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-stone-400 hover:text-stone-700 mb-8 text-sm transition-colors group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
        Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div id={'images'}>
          <div className="bg-cream-100 rounded-3xl overflow-hidden mb-3 shadow-soft">
            <img
              src={images[selectedImage]}
              alt={product.title}
              className="w-full h-[420px] object-contain p-6"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === i ? 'border-brand-500 shadow-soft' : 'border-cream-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div id={'info'} className="flex flex-col">
          <p className="text-[11px] font-semibold text-brand-500 uppercase tracking-widest mb-2">{product.category}</p>
          <h1 className="font-display text-4xl text-stone-800 leading-tight mb-2">{product.title}</h1>
          {product.brand && <p className="text-stone-400 text-sm mb-4 font-light">by {product.brand}</p>}

          <div className="flex items-center gap-2 mb-6">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} size={14}
                  className={s <= Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-cream-200 fill-cream-200'} />
              ))}
            </div>
            <span className="text-sm text-stone-400">{product.rating} · {product.stock} in stock</span>
          </div>

          <div className="flex items-end gap-3 mb-6">
            <span className="font-display text-5xl text-stone-800">${product.price}</span>
            {product.discountPercentage > 0 && (
              <span className="mb-1 text-sm text-emerald-600 font-medium bg-emerald-50 px-2.5 py-1 rounded-full">
                {Math.round(product.discountPercentage)}% off
              </span>
            )}
          </div>

          <p className="text-stone-500 leading-relaxed text-sm mb-8 font-light">{product.description}</p>

          <div className="flex items-center gap-4 mb-5">
            <div className="flex items-center bg-cream-100 rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="px-4 py-2.5 text-stone-500 hover:text-stone-800 hover:bg-cream-200 transition-colors text-lg leading-none"
              >−</button>
              <span className="px-5 py-2.5 text-sm font-medium text-stone-800 min-w-[3rem] text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                className="px-4 py-2.5 text-stone-500 hover:text-stone-800 hover:bg-cream-200 transition-colors text-lg leading-none"
              >+</button>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-brand-700 text-cream-50 text-sm font-medium rounded-xl hover:bg-brand-800 transition-colors"
            >
              <ShoppingBag size={16} /> Add to Cart
            </button>

            <button
              onClick={handleToggleFavorite}
              className="w-11 h-11 flex items-center justify-center border border-cream-200 bg-white rounded-xl hover:border-rose-200 transition-colors shadow-soft"
            >
              <Heart size={18} className={isFavorite ? 'fill-rose-400 text-rose-400' : 'text-stone-300'} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-cream-200 mt-auto">
            {[
              { icon: <Truck size={16} className="text-brand-500" />, label: product.shippingInformation ?? 'Free Shipping' },
              { icon: <Shield size={16} className="text-brand-500" />, label: product.warrantyInformation ?? 'Warranty' },
              { icon: <RotateCcw size={16} className="text-brand-500" />, label: product.returnPolicy ?? 'Easy Returns' },
            ].map((b, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-1.5 p-3 bg-cream-50 rounded-xl">
                {b.icon}
                <span className="text-[11px] text-stone-400 leading-tight">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
