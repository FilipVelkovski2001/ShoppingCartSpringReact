import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Search, Heart, ShoppingBag, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { productApi, userApi } from '../api';
import { useCart } from '../context/CartContext';
import type { ProductDto, CategoryDto } from '../dto';

const PAGE_SIZES = [12, 24, 48] as const;

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: 'id-asc',      label: 'Default' },
  { value: 'price-asc',   label: 'Price: Low → High' },
  { value: 'price-desc',  label: 'Price: High → Low' },
  { value: 'rating-desc', label: 'Top Rated' },
  { value: 'title-asc',   label: 'Name A → Z' },
];

export default function ProductsPage(): React.JSX.Element {
  const [products, setProducts]       = useState<ProductDto[]>([]);
  const [total, setTotal]             = useState<number>(0);
  const [loading, setLoading]         = useState<boolean>(true);
  const [searchInput, setSearchInput] = useState<string>('');
  const [search, setSearch]           = useState<string>('');
  const [page, setPage]               = useState<number>(0);
  const [pageSize, setPageSize]       = useState<number>(12);
  const [sort, setSort]               = useState<string>('id-asc');
  const [category, setCategory]       = useState<string>('');
  const [categories, setCategories]   = useState<CategoryDto[]>([]);
  const [favorites, setFavorites]     = useState<Set<number>>(new Set());
  const { addItem } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    productApi.getCategories().then(({ data }) => {
      const cats = data.data?.categories ?? [];
      setCategories(Array.isArray(cats) ? cats : []);
    });
    userApi.getMe().then(({ data }) => {
      setFavorites(new Set(data.data?.favoriteProductIds ?? []));
    }).catch(() => {});
  }, []);

  const fetchProducts = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const [sortBy, order] = sort.split('-');
      const params: Record<string, unknown> = {
        limit: pageSize, skip: page * pageSize, sortBy, order,
        ...(search && { search }),
      };
      const req = category
        ? await productApi.getByCategory(category, params)
        : await productApi.getAll(params);
      const { data } = req;
      setProducts(data.data?.products ?? []);
      setTotal(data.data?.total ?? 0);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, sort, search, category]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(0);
    setCategory('');
  };

  const handleAddToCart = async (e: React.MouseEvent, product: ProductDto): Promise<void> => {
    e.stopPropagation();
    try {
      await addItem(product);
      toast.success('Added to cart');
    } catch {
      toast.error('Could not add to cart');
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent, productId: number): Promise<void> => {
    e.stopPropagation();
    try {
      if (favorites.has(productId)) {
        await userApi.removeFavorite(productId);
        setFavorites(prev => { const s = new Set(prev); s.delete(productId); return s; });
      } else {
        await userApi.addFavorite(productId);
        setFavorites(prev => new Set([...prev, productId]));
      }
    } catch {
      toast.error('Could not update favorites');
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  const getCategoryLabel = (cat: CategoryDto | string): string =>
    typeof cat === 'string' ? cat : cat.name;

  const getCategoryValue = (cat: CategoryDto | string): string =>
    typeof cat === 'string' ? cat : cat.slug;

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-display text-4xl text-stone-800 mb-1">Products</h1>
        <p className="text-stone-400 font-light text-sm">
          {total > 0 ? `${total} items available` : ''}
          {search && ` · "${search}"`}
          {category && ` · ${category}`}
        </p>
      </div>

      <div id={'filters'} className="flex flex-col sm:flex-row gap-3 mb-8">
        <form onSubmit={handleSearch} className="flex flex-1 gap-2">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-300" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-3.5 bg-white border border-cream-200 rounded-xl text-sm text-stone-700 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-brand-300 shadow-soft transition"
            />
          </div>
          <button type="submit" className="px-5 py-3.5 bg-brand-700 text-cream-50 text-sm rounded-xl hover:bg-brand-800 transition-colors font-medium">
            Search
          </button>
        </form>

        <div className="flex gap-2">
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(0); setSearch(''); setSearchInput(''); }}
            className="px-3 py-3.5 bg-white border border-cream-200 rounded-xl text-sm text-stone-600 focus:outline-none focus:ring-2 focus:ring-brand-300 shadow-soft"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={getCategoryValue(cat)} value={getCategoryValue(cat)}>
                {getCategoryLabel(cat)}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(0); }}
            className="px-3 py-3.5 bg-white border border-cream-200 rounded-xl text-sm text-stone-600 focus:outline-none focus:ring-2 focus:ring-brand-300 shadow-soft"
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(0); }}
            className="px-5 py-2.5 bg-white border border-cream-200 rounded-xl text-sm text-stone-600 focus:outline-none focus:ring-2 focus:ring-brand-300 shadow-soft"
          >
            {PAGE_SIZES.map(s => <option key={s} value={s}>{s} / page</option>)}
          </select>
        </div>
      </div>

      {(search || category) && (
        <div className="mb-5">
          <button
            onClick={() => { setSearch(''); setSearchInput(''); setCategory(''); setPage(0); }}
            className="text-xs text-brand-600 hover:text-brand-800 underline underline-offset-2 transition-colors"
          >
            Clear filters
          </button>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: pageSize }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl h-80 animate-pulse shadow-soft" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24">
          <Search size={40} className="mx-auto mb-4 text-stone-200" />
          <p className="text-stone-400 font-light">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => navigate(`/products/${product.id}`)}
              className="bg-white rounded-2xl shadow-soft border border-cream-200 overflow-hidden cursor-pointer hover:shadow-card hover:-translate-y-0.5 transition-all duration-300 group"
            >
              <div className="relative overflow-hidden bg-cream-100 h-48">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button
                  onClick={(e) => handleToggleFavorite(e, product.id)}
                  className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-soft hover:scale-110 transition-transform"
                >
                  <Heart
                    size={14}
                    className={favorites.has(product.id) ? 'fill-rose-400 text-rose-400' : 'text-stone-300'}
                  />
                </button>
                {product.discountPercentage > 0 && (
                  <span className="absolute top-3 left-3 bg-brand-700 text-cream-50 text-[10px] font-semibold px-2 py-0.5 rounded-full tracking-wide">
                    -{Math.round(product.discountPercentage)}%
                  </span>
                )}
              </div>

              <div className="p-4">
                <p className="text-[10px] font-semibold text-brand-500 uppercase tracking-widest mb-1">{product.category}</p>
                <h3 className="text-sm font-medium text-stone-800 line-clamp-2 leading-snug mb-2">{product.title}</h3>
                <div className="flex items-center gap-1 mb-3">
                  <Star size={11} className="fill-amber-400 text-amber-400" />
                  <span className="text-xs text-stone-400">{product.rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-display text-lg text-stone-800">${product.price}</span>
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-700 text-cream-50 text-xs font-medium rounded-lg hover:bg-brand-800 transition-colors"
                  >
                    <ShoppingBag size={12} /> Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div id={'pagination'} className="flex items-center justify-center gap-1.5 mt-12">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-cream-200 bg-white text-stone-400 disabled:opacity-30 hover:border-brand-300 hover:text-brand-700 transition"
          >
            <ChevronLeft size={16} />
          </button>

          {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
            const p = totalPages <= 7 ? i
              : page < 4 ? i
              : page > totalPages - 5 ? totalPages - 7 + i
              : page - 3 + i;
            return (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-9 h-9 rounded-xl text-sm font-medium transition ${
                  page === p
                    ? 'bg-brand-700 text-cream-50 shadow-soft'
                    : 'bg-white border border-cream-200 text-stone-500 hover:border-brand-300 hover:text-brand-700'
                }`}
              >
                {p + 1}
              </button>
            );
          })}

          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-cream-200 bg-white text-stone-400 disabled:opacity-30 hover:border-brand-300 hover:text-brand-700 transition"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
