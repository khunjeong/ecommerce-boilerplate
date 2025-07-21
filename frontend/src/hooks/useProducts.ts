import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsAPI, categoriesAPI } from '@/lib/api';
import {
  ProductQueryParams,
  CreateProductRequest,
  UpdateProductRequest,
} from '@/types/product';
import { toast } from 'sonner';

// 상품 목록 조회 훅
export const useProducts = (params?: ProductQueryParams) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productsAPI.getProducts(params),
    staleTime: 5 * 60 * 1000, // 5분
  });
};

// 상품 상세 조회 훅
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productsAPI.getProduct(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// 카테고리 목록 조회 훅
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesAPI.getCategories(),
    staleTime: 10 * 60 * 1000, // 10분
  });
};

// 상품 생성 훅
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductRequest) => productsAPI.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('상품이 성공적으로 생성되었습니다.');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '상품 생성에 실패했습니다.');
    },
  });
};

// 상품 수정 훅
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductRequest }) =>
      productsAPI.updateProduct(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', id] });
      toast.success('상품이 성공적으로 수정되었습니다.');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '상품 수정에 실패했습니다.');
    },
  });
};

// 상품 삭제 훅
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productsAPI.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('상품이 성공적으로 삭제되었습니다.');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '상품 삭제에 실패했습니다.');
    },
  });
};

// 카테고리 생성 훅
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      name: string;
      description: string;
      image: string;
      parentId?: string;
    }) => categoriesAPI.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('카테고리가 성공적으로 생성되었습니다.');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || '카테고리 생성에 실패했습니다.'
      );
    },
  });
};

// 카테고리 수정 훅
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: {
        name?: string;
        description?: string;
        image?: string;
        parentId?: string;
      };
    }) => categoriesAPI.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('카테고리가 성공적으로 수정되었습니다.');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || '카테고리 수정에 실패했습니다.'
      );
    },
  });
};

// 카테고리 삭제 훅
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoriesAPI.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('카테고리가 성공적으로 삭제되었습니다.');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || '카테고리 삭제에 실패했습니다.'
      );
    },
  });
};
