export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  variantId?: string;
  quantity: number;
  createdAt: string;
  product: {
    id: string;
    name: string;
    description: string;
    price: string;
    comparePrice?: string;
    sku: string;
    stock: number;
    isActive: boolean;
    images: {
      id: string;
      url: string;
      alt?: string;
      isPrimary: boolean;
    }[];
    category: {
      id: string;
      name: string;
    };
  };
  variant?: {
    id: string;
    name: string;
    value: string;
    price?: string;
    stock: number;
  };
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: string;
}

export interface AddToCartRequest {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}
