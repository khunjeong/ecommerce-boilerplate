import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersAPI } from '@/lib/api';
import { toast } from 'sonner';
import type {
  Order,
  OrdersResponse,
  CreateOrderRequest,
  UpdateOrderRequest,
  QueryOrderRequest,
} from '@/types/order';

// 주문 목록 조회
export const useOrders = (params?: QueryOrderRequest) => {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => ordersAPI.getOrders(params),
  });
};

// 주문 상세 조회
export const useOrder = (id: string) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersAPI.getOrder(id),
    enabled: !!id,
  });
};

// 주문 생성
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderRequest) => ordersAPI.createOrder(data),
    onSuccess: () => {
      toast.success('주문이 성공적으로 생성되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '주문 생성에 실패했습니다.');
    },
  });
};

// 주문 업데이트
export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderRequest }) =>
      ordersAPI.updateOrder(id, data),
    onSuccess: (_, { id }) => {
      toast.success('주문이 성공적으로 업데이트되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', id] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || '주문 업데이트에 실패했습니다.'
      );
    },
  });
};

// 주문 취소
export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ordersAPI.cancelOrder(id),
    onSuccess: (_, id) => {
      toast.success('주문이 성공적으로 취소되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', id] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '주문 취소에 실패했습니다.');
    },
  });
};
