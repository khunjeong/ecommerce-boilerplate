export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  variantId?: string;
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

export interface Wishlist {
  items: WishlistItem[];
  totalItems: number;
}

export interface AddToWishlistRequest {
  productId: string;
  variantId?: string;
}

export interface WishlistCheckResponse {
  isInWishlist: boolean;
}
