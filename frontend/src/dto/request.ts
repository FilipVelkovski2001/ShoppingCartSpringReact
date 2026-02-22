export interface Login {
  username: string;
  password: string;
}

export interface Register {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AddItem {
  productId: number;
  quantity: number;
  productTitle: string;
  productPrice: number;
  productThumbnail: string;
}

export interface UpdateQuantityRequest {
  quantity: number;
}
