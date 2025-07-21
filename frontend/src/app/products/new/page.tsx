'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateProduct, useCategories } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Plus, X } from 'lucide-react';
import Link from 'next/link';

const createProductSchema = z.object({
  name: z.string().min(1, '상품명을 입력해주세요'),
  description: z.string().min(1, '상품 설명을 입력해주세요'),
  price: z.string().min(1, '가격을 입력해주세요'),
  comparePrice: z.string().optional(),
  sku: z.string().min(1, 'SKU를 입력해주세요'),
  barcode: z.string().optional(),
  weight: z.string().optional(),
  dimensions: z.string().optional(),
  stock: z.number().min(0, '재고는 0 이상이어야 합니다'),
  minStock: z.number().min(0, '최소 재고는 0 이상이어야 합니다'),
  categoryId: z.string().min(1, '카테고리를 선택해주세요'),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  imageUrls: z.array(z.string()),
  tagNames: z.array(z.string()),
});

type CreateProductForm = z.infer<typeof createProductSchema>;

export default function CreateProductPage() {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState('');
  const [tagName, setTagName] = useState('');

  const { data: categories } = useCategories();
  const createProductMutation = useCreateProduct();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateProductForm>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      isActive: true,
      isFeatured: false,
      imageUrls: [],
      tagNames: [],
      stock: 0,
      minStock: 0,
    },
  });

  const watchedImageUrls = watch('imageUrls');
  const watchedTagNames = watch('tagNames');

  const addImageUrl = () => {
    if (imageUrl && !watchedImageUrls.includes(imageUrl)) {
      setValue('imageUrls', [...watchedImageUrls, imageUrl]);
      setImageUrl('');
    }
  };

  const removeImageUrl = (index: number) => {
    setValue(
      'imageUrls',
      watchedImageUrls.filter((_, i) => i !== index)
    );
  };

  const addTagName = () => {
    if (tagName && !watchedTagNames.includes(tagName)) {
      setValue('tagNames', [...watchedTagNames, tagName]);
      setTagName('');
    }
  };

  const removeTagName = (index: number) => {
    setValue(
      'tagNames',
      watchedTagNames.filter((_, i) => i !== index)
    );
  };

  const onSubmit = async (data: CreateProductForm) => {
    try {
      await createProductMutation.mutateAsync(data);
      router.push('/products');
    } catch (error) {
      console.error('상품 생성 실패:', error);
    }
  };

  const formatCategoryPath = (category: any): string => {
    const path = [category.name];
    let current = category;

    while (current.parent) {
      path.unshift(current.parent.name);
      current = current.parent;
    }

    return path.join(' > ');
  };

  return (
    <div className="container mx-auto py-8">
      {/* 헤더 */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/products">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            목록으로
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">새 상품 추가</h1>
          <p className="text-muted-foreground mt-2">새로운 상품을 등록합니다</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 기본 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">상품명 *</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="상품명을 입력하세요"
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="description">상품 설명 *</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="상품에 대한 자세한 설명을 입력하세요"
                  rows={4}
                />
                {errors.description && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">가격 *</Label>
                  <Input
                    id="price"
                    type="number"
                    {...register('price')}
                    placeholder="0"
                  />
                  {errors.price && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.price.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="comparePrice">비교 가격</Label>
                  <Input
                    id="comparePrice"
                    type="number"
                    {...register('comparePrice')}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sku">SKU *</Label>
                  <Input id="sku" {...register('sku')} placeholder="SKU 코드" />
                  {errors.sku && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.sku.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="barcode">바코드</Label>
                  <Input
                    id="barcode"
                    {...register('barcode')}
                    placeholder="바코드"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 카테고리 및 상태 */}
          <Card>
            <CardHeader>
              <CardTitle>카테고리 및 상태</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="categoryId">카테고리 *</Label>
                <Select onValueChange={value => setValue('categoryId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="카테고리를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map(category => (
                      <SelectItem key={category.id} value={category.id || ''}>
                        {formatCategoryPath(category)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.categoryId && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.categoryId.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stock">재고 *</Label>
                  <Input
                    id="stock"
                    type="number"
                    {...register('stock', { valueAsNumber: true })}
                    placeholder="0"
                  />
                  {errors.stock && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.stock.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="minStock">최소 재고</Label>
                  <Input
                    id="minStock"
                    type="number"
                    {...register('minStock', { valueAsNumber: true })}
                    placeholder="0"
                  />
                  {errors.minStock && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.minStock.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="weight">무게 (g)</Label>
                  <Input id="weight" {...register('weight')} placeholder="0" />
                </div>

                <div>
                  <Label htmlFor="dimensions">크기</Label>
                  <Input
                    id="dimensions"
                    {...register('dimensions')}
                    placeholder="가로x세로x높이"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={watch('isActive')}
                  onCheckedChange={checked => setValue('isActive', checked)}
                />
                <Label htmlFor="isActive">활성 상태</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isFeatured"
                  checked={watch('isFeatured')}
                  onCheckedChange={checked => setValue('isFeatured', checked)}
                />
                <Label htmlFor="isFeatured">추천 상품</Label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 이미지 */}
        <Card>
          <CardHeader>
            <CardTitle>상품 이미지</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                placeholder="이미지 URL을 입력하세요"
                className="flex-1"
              />
              <Button type="button" onClick={addImageUrl}>
                <Plus className="w-4 h-4 mr-2" />
                추가
              </Button>
            </div>

            {watchedImageUrls.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {watchedImageUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`상품 이미지 ${index + 1}`}
                      className="w-full h-32 object-cover rounded-md"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1"
                      onClick={() => removeImageUrl(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {errors.imageUrls && (
              <p className="text-sm text-red-500">{errors.imageUrls.message}</p>
            )}
          </CardContent>
        </Card>

        {/* 태그 */}
        <Card>
          <CardHeader>
            <CardTitle>태그</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={tagName}
                onChange={e => setTagName(e.target.value)}
                placeholder="태그명을 입력하세요"
                className="flex-1"
              />
              <Button type="button" onClick={addTagName}>
                <Plus className="w-4 h-4 mr-2" />
                추가
              </Button>
            </div>

            {watchedTagNames.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {watchedTagNames.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 bg-secondary px-3 py-1 rounded-full"
                  >
                    <span className="text-sm">{tag}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTagName(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 제출 버튼 */}
        <div className="flex justify-end gap-4">
          <Link href="/products">
            <Button variant="outline" type="button">
              취소
            </Button>
          </Link>
          <Button type="submit" disabled={createProductMutation.isPending}>
            {createProductMutation.isPending ? '생성 중...' : '상품 생성'}
          </Button>
        </div>
      </form>
    </div>
  );
}
