export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface AuthDto {
  token: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface UserDto {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  favoriteProductIds: number[];
}

export interface CartItemDto {
  id: number;
  productId: number;
  quantity: number;
  productTitle: string;
  productPrice: number;
  productThumbnail: string;
  subtotal: number;
}

export interface CartDto {
  id: number;
  items: CartItemDto[];
  total: number;
  totalItems: number;
}

export interface ProductDto {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand?: string;
  category: string;
  thumbnail: string;
  images: string[];
  shippingInformation?: string;
  warrantyInformation?: string;
  returnPolicy?: string;
}

export interface ProductListDto {
  products: ProductDto[];
  total: number;
  skip: number;
  limit: number;
}

export interface CategoryDto {
  slug: string;
  name: string;
  url: string;
}
