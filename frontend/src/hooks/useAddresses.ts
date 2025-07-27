import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { addressesAPI } from '@/lib/api';
import { toast } from 'sonner';
import type {
  Address,
  CreateAddressRequest,
  UpdateAddressRequest,
} from '@/types/order';

// 배송지 목록 조회
export const useAddresses = () => {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: () => addressesAPI.getAddresses(),
  });
};

// 배송지 상세 조회
export const useAddress = (id: string) => {
  return useQuery({
    queryKey: ['address', id],
    queryFn: () => addressesAPI.getAddress(id),
    enabled: !!id,
  });
};

// 배송지 생성
export const useCreateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAddressRequest) =>
      addressesAPI.createAddress(data),
    onSuccess: () => {
      toast.success('배송지가 성공적으로 생성되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || '배송지 생성에 실패했습니다.'
      );
    },
  });
};

// 배송지 업데이트
export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAddressRequest }) =>
      addressesAPI.updateAddress(id, data),
    onSuccess: (_, { id }) => {
      toast.success('배송지가 성공적으로 업데이트되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      queryClient.invalidateQueries({ queryKey: ['address', id] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || '배송지 업데이트에 실패했습니다.'
      );
    },
  });
};

// 배송지 삭제
export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => addressesAPI.deleteAddress(id),
    onSuccess: () => {
      toast.success('배송지가 성공적으로 삭제되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || '배송지 삭제에 실패했습니다.'
      );
    },
  });
};

// 기본 배송지 설정
export const useSetDefaultAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => addressesAPI.setDefaultAddress(id),
    onSuccess: () => {
      toast.success('기본 배송지가 설정되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || '기본 배송지 설정에 실패했습니다.'
      );
    },
  });
};
