import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wishlistAPI } from '@/lib/api';
import { AddToWishlistRequest } from '@/types/wishlist';
import { toast } from 'sonner';

// 위시리스트 조회 훅
export const useWishlist = () => {
  return useQuery({
    queryKey: ['wishlist'],
    queryFn: wishlistAPI.getWishlist,
  });
};

// 위시리스트에 상품 추가 훅
export const useAddToWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddToWishlistRequest) => wishlistAPI.addToWishlist(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success('위시리스트에 추가되었습니다.');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || '위시리스트 추가에 실패했습니다.'
      );
    },
  });
};

// 위시리스트에서 상품 제거 훅
export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => wishlistAPI.removeFromWishlist(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success('위시리스트에서 제거되었습니다.');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message ||
          '위시리스트에서 제거하는데 실패했습니다.'
      );
    },
  });
};

// 위시리스트 비우기 훅
export const useClearWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => wishlistAPI.clearWishlist(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success('위시리스트가 비워졌습니다.');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || '위시리스트 비우기에 실패했습니다.'
      );
    },
  });
};

// 상품이 위시리스트에 있는지 확인하는 훅
export const useCheckWishlist = (productId: string) => {
  return useQuery({
    queryKey: ['wishlist', 'check', productId],
    queryFn: () => wishlistAPI.checkWishlist(productId),
    enabled: !!productId,
  });
};
