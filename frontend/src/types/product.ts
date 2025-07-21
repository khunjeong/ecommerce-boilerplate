export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  alt?: string;
  order: number;
  isPrimary: boolean;
  createdAt: string;
}

export interface ProductTag {
  id: string;
  name: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  parentId?: string;
  parent?: Category;
  children?: Category[];
  createdAt: string;
  updatedAt: string;
}

export interface Seller {
  id: string;
  userId: string;
  companyName: string;
  description: string;
  website: string;
  phone: string;
  address: string;
  businessNumber: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  comparePrice: string;
  sku: string;
  barcode?: string;
  weight?: string;
  dimensions?: string;
  stock: number;
  minStock: number;
  isActive: boolean;
  isFeatured: boolean;
  rating: number;
  reviewCount: number;
  viewCount: number;
  soldCount: number;
  createdAt: string;
  updatedAt: string;
  categoryId: string;
  sellerId: string;
  category: Category;
  images: ProductImage[];
  tags: ProductTag[];
  seller: Seller;
  _count: {
    reviews: number;
  };
}

export interface ProductListResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: string;
  comparePrice?: string;
  sku: string;
  barcode?: string;
  weight?: string;
  dimensions?: string;
  stock: number;
  minStock?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  categoryId: string;
  imageUrls?: string[];
  tagNames?: string[];
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: string;
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  minPrice?: string;
  maxPrice?: string;
  sortBy?: 'name' | 'price' | 'createdAt' | 'rating';
  sortOrder?: 'asc' | 'desc';
}

export interface CategoryListResponse {
  categories: Category[];
}
