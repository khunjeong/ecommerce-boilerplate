import axios from 'axios';
import {
  Product,
  ProductListResponse,
  CreateProductRequest,
  UpdateProductRequest,
  ProductQueryParams,
  Category,
  CategoryListResponse,
} from '@/types/product';
import {
  Cart,
  CartItem,
  AddToCartRequest,
  UpdateCartItemRequest,
} from '@/types/cart';
import {
  Wishlist,
  WishlistItem,
  AddToWishlistRequest,
  WishlistCheckResponse,
} from '@/types/wishlist';
import {
  Order,
  OrdersResponse,
  CreateOrderRequest,
  UpdateOrderRequest,
  QueryOrderRequest,
  Address,
  CreateAddressRequest,
  UpdateAddressRequest,
} from '@/types/order';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 - 토큰 추가
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 토큰 만료 처리
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 인증 관련 API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  register: (userData: {
    email: string;
    password: string;
    name: string;
    role?: string;
  }) => api.post('/auth/register', userData),

  getProfile: () => api.get('/auth/profile'),
};

// 사용자 관련 API
export const usersAPI = {
  getUsers: () => api.get('/users'),
  getUser: (id: string) => api.get(`/users/${id}`),
  createUser: (userData: any) => api.post('/users', userData),
  updateUser: (id: string, userData: any) =>
    api.patch(`/users/${id}`, userData),
  deleteUser: (id: string) => api.delete(`/users/${id}`),
};

// 상품 관련 API
export const productsAPI = {
  // 상품 목록 조회
  getProducts: async (
    params?: ProductQueryParams
  ): Promise<ProductListResponse> => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  // 상품 상세 조회
  getProduct: async (id: string): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // 상품 생성
  createProduct: async (data: CreateProductRequest): Promise<Product> => {
    const response = await api.post('/products', data);
    return response.data;
  },

  // 상품 수정
  updateProduct: async (
    id: string,
    data: UpdateProductRequest
  ): Promise<Product> => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  // 상품 삭제
  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};

// 카테고리 관련 API
export const categoriesAPI = {
  // 카테고리 목록 조회
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get('/categories');
    return response.data;
  },

  // 카테고리 상세 조회
  getCategory: async (id: string): Promise<Category> => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  // 카테고리 생성
  createCategory: async (data: {
    name: string;
    description: string;
    image: string;
    parentId?: string;
  }): Promise<Category> => {
    const response = await api.post('/categories', data);
    return response.data;
  },

  // 카테고리 수정
  updateCategory: async (
    id: string,
    data: {
      name?: string;
      description?: string;
      image?: string;
      parentId?: string;
    }
  ): Promise<Category> => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },

  // 카테고리 삭제
  deleteCategory: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};

// 장바구니 관련 API
export const cartAPI = {
  // 장바구니 조회
  getCart: async (): Promise<Cart> => {
    const response = await api.get('/cart');
    return response.data;
  },

  // 장바구니에 상품 추가
  addToCart: async (data: AddToCartRequest): Promise<CartItem> => {
    const response = await api.post('/cart', data);
    return response.data;
  },

  // 장바구니 아이템 수정
  updateCartItem: async (
    id: string,
    data: UpdateCartItemRequest
  ): Promise<CartItem> => {
    const response = await api.put(`/cart/${id}`, data);
    return response.data;
  },

  // 장바구니에서 상품 제거
  removeFromCart: async (id: string): Promise<void> => {
    await api.delete(`/cart/${id}`);
  },

  // 장바구니 비우기
  clearCart: async (): Promise<void> => {
    await api.delete('/cart');
  },
};

// 위시리스트 관련 API
export const wishlistAPI = {
  // 위시리스트 조회
  getWishlist: async (): Promise<Wishlist> => {
    const response = await api.get('/wishlist');
    return response.data;
  },

  // 위시리스트에 상품 추가
  addToWishlist: async (data: AddToWishlistRequest): Promise<WishlistItem> => {
    const response = await api.post('/wishlist', data);
    return response.data;
  },

  // 위시리스트에서 상품 제거
  removeFromWishlist: async (id: string): Promise<void> => {
    await api.delete(`/wishlist/${id}`);
  },

  // 위시리스트 비우기
  clearWishlist: async (): Promise<void> => {
    await api.delete('/wishlist');
  },

  // 상품이 위시리스트에 있는지 확인
  checkWishlist: async (productId: string): Promise<WishlistCheckResponse> => {
    const response = await api.get(`/wishlist/check/${productId}`);
    return response.data;
  },
};

// 주문 관련 API
export const ordersAPI = {
  getOrders: async (params?: QueryOrderRequest): Promise<OrdersResponse> => {
    const response = await api.get('/orders', { params });
    return response.data;
  },
  getOrder: async (id: string): Promise<Order> => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
  createOrder: async (data: CreateOrderRequest): Promise<Order> => {
    const response = await api.post('/orders', data);
    return response.data;
  },
  updateOrder: async (id: string, data: UpdateOrderRequest): Promise<Order> => {
    const response = await api.patch(`/orders/${id}`, data);
    return response.data;
  },
  cancelOrder: async (id: string): Promise<Order> => {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
  },
};

// 배송지 관련 API
export const addressesAPI = {
  getAddresses: async (): Promise<Address[]> => {
    const response = await api.get('/addresses');
    return response.data;
  },
  getAddress: async (id: string): Promise<Address> => {
    const response = await api.get(`/addresses/${id}`);
    return response.data;
  },
  createAddress: async (data: CreateAddressRequest): Promise<Address> => {
    const response = await api.post('/addresses', data);
    return response.data;
  },
  updateAddress: async (
    id: string,
    data: UpdateAddressRequest
  ): Promise<Address> => {
    const response = await api.patch(`/addresses/${id}`, data);
    return response.data;
  },
  deleteAddress: async (id: string): Promise<void> => {
    await api.delete(`/addresses/${id}`);
  },
  setDefaultAddress: async (id: string): Promise<Address> => {
    const response = await api.patch(`/addresses/${id}/default`);
    return response.data;
  },
};
