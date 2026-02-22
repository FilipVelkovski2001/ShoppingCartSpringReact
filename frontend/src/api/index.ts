import axios, { AxiosResponse } from 'axios';
import type {
  ApiResponse,
  AuthDto,
  UserDto,
  CartDto,
  ProductDto,
  ProductListDto,
  CategoryDto,
} from '../dto';
import type { Login, Register, AddItem, UpdateQuantityRequest } from '../dto';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

export const authApi = {
  login: (data: Login): Promise<AxiosResponse<ApiResponse<AuthDto>>> =>
    api.post('/auth/login', data),

  register: (data: Register): Promise<AxiosResponse<ApiResponse<AuthDto>>> =>
    api.post('/auth/register', data),
};

export const userApi = {
  getMe: (): Promise<AxiosResponse<ApiResponse<UserDto>>> =>
    api.get('/users/me'),

  addFavorite: (productId: number): Promise<AxiosResponse<ApiResponse<UserDto>>> =>
    api.post(`/users/favorites/${productId}`),

  removeFavorite: (productId: number): Promise<AxiosResponse<ApiResponse<UserDto>>> =>
    api.delete(`/users/favorites/${productId}`),
};

export const productApi = {
  getAll: (params?: Record<string, unknown>): Promise<AxiosResponse<ApiResponse<ProductListDto>>> =>
    api.get('/products', { params }),

  getById: (id: number): Promise<AxiosResponse<ApiResponse<ProductDto>>> =>
    api.get(`/products/${id}`),

  getCategories: (): Promise<AxiosResponse<ApiResponse<{ categories: CategoryDto[] }>>> =>
    api.get('/products/categories'),

  getByCategory: (
    category: string,
    params?: Record<string, unknown>
  ): Promise<AxiosResponse<ApiResponse<ProductListDto>>> =>
    api.get(`/products/category/${category}`, { params }),
};

export const cartApi = {
  getCart: (): Promise<AxiosResponse<ApiResponse<CartDto>>> =>
    api.get('/cart'),

  addItem: (data: AddItem): Promise<AxiosResponse<ApiResponse<CartDto>>> =>
    api.post('/cart/items', data),

  updateQuantity: (
    productId: number,
    data: UpdateQuantityRequest
  ): Promise<AxiosResponse<ApiResponse<CartDto>>> =>
    api.patch(`/cart/items/${productId}`, data),

  removeItem: (productId: number): Promise<AxiosResponse<ApiResponse<CartDto>>> =>
    api.delete(`/cart/items/${productId}`),

  clearCart: (): Promise<AxiosResponse<ApiResponse<void>>> =>
    api.delete('/cart'),
};
