export interface OrderItem {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
  totalPrice: number;
  createdAt: string;
  product: {
    id: string;
    name: string;
    price: number;
    images: Array<{
      id: string;
      url: string;
      isPrimary: boolean;
    }>;
  };
  variant?: {
    id: string;
    name: string;
    price: number;
  };
}

export interface Shipping {
  id: string;
  method: 'STANDARD' | 'EXPRESS' | 'SAME_DAY';
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'FAILED';
  trackingNumber?: string;
  trackingUrl?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  notes?: string;
}

export interface Address {
  id: string;
  type: 'SHIPPING' | 'BILLING';
  name: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status:
    | 'PENDING'
    | 'CONFIRMED'
    | 'PROCESSING'
    | 'SHIPPED'
    | 'DELIVERED'
    | 'CANCELLED'
    | 'REFUNDED';
  totalAmount: number;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  currency: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  shipping?: Shipping;
  billingAddress: Address;
  shippingAddress: Address;
}

export interface CreateOrderRequest {
  shippingAddressId: string;
  billingAddressId: string;
  shippingMethod: 'STANDARD' | 'EXPRESS' | 'SAME_DAY';
  notes?: string;
  items: Array<{
    productId: string;
    variantId?: string;
    quantity: number;
  }>;
}

export interface UpdateOrderRequest {
  status?:
    | 'PENDING'
    | 'CONFIRMED'
    | 'PROCESSING'
    | 'SHIPPED'
    | 'DELIVERED'
    | 'CANCELLED'
    | 'REFUNDED';
  notes?: string;
}

export interface QueryOrderRequest {
  status?:
    | 'PENDING'
    | 'CONFIRMED'
    | 'PROCESSING'
    | 'SHIPPED'
    | 'DELIVERED'
    | 'CANCELLED'
    | 'REFUNDED';
  page?: number;
  limit?: number;
  orderNumber?: string;
}

export interface OrdersResponse {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// 배송지 관련 타입
export interface CreateAddressRequest {
  type: 'SHIPPING' | 'BILLING';
  name: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country?: string;
  isDefault?: boolean;
}

export interface UpdateAddressRequest extends Partial<CreateAddressRequest> {}
