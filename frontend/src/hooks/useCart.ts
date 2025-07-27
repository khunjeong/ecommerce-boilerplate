import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartAPI } from '@/lib/api';
import { AddToCartRequest, UpdateCartItemRequest } from '@/types/cart';
import { toast } from 'sonner';

// 장바구니 조회 훅
export const useCart = () => {
  return useQuery({
    queryKey: ['cart'],
    queryFn: cartAPI.getCart,
  });
};

// 장바구니에 상품 추가 훅
export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddToCartRequest) => cartAPI.addToCart(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('장바구니에 추가되었습니다.');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || '장바구니 추가에 실패했습니다.'
      );
    },
  });
};

// 장바구니 아이템 수정 훅
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCartItemRequest }) =>
      cartAPI.updateCartItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('장바구니가 업데이트되었습니다.');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || '장바구니 업데이트에 실패했습니다.'
      );
    },
  });
};

// 장바구니에서 상품 제거 훅
export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cartAPI.removeFromCart(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('장바구니에서 제거되었습니다.');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || '장바구니에서 제거하는데 실패했습니다.'
      );
    },
  });
};

// 장바구니 비우기 훅
export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cartAPI.clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('장바구니가 비워졌습니다.');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || '장바구니 비우기에 실패했습니다.'
      );
    },
  });
};
