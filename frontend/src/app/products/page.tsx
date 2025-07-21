'use client';

import { useState } from 'react';
import {
  useProducts,
  useCategories,
  useDeleteProduct,
} from '@/hooks/useProducts';
import { Product, Category } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('all');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'createdAt'>(
    'createdAt'
  );
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const { data: productsData, isLoading: productsLoading } = useProducts({
    page,
    limit: 12,
    search: search || undefined,
    categoryId: categoryId === 'all' ? undefined : categoryId || undefined,
    sortBy,
    sortOrder,
  });

  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const deleteProductMutation = useDeleteProduct();

  const handleDeleteProduct = async (id: string) => {
    if (confirm('정말로 이 상품을 삭제하시겠습니까?')) {
      await deleteProductMutation.mutateAsync(id);
    }
  };

  const formatCategoryPath = (category: Category): string => {
    const path = [category.name];
    let current = category;

    while (current.parent) {
      path.unshift(current.parent.name);
      current = current.parent;
    }

    return path.join(' > ');
  };

  if (productsLoading || categoriesLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">로딩 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">상품 관리</h1>
          <p className="text-muted-foreground mt-2">
            총 {productsData?.pagination.total || 0}개의 상품
          </p>
        </div>
        <Link href="/products/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />새 상품 추가
          </Button>
        </Link>
      </div>

      {/* 필터 및 검색 */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="상품명, 설명, SKU 검색..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="카테고리 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 카테고리</SelectItem>
                {categories?.map(category => (
                  <SelectItem key={category.id} value={category.id || ''}>
                    {formatCategoryPath(category)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={sortBy}
              onValueChange={(value: 'name' | 'price' | 'createdAt') =>
                setSortBy(value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="정렬 기준" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">등록일</SelectItem>
                <SelectItem value="name">상품명</SelectItem>
                <SelectItem value="price">가격</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={sortOrder}
              onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="정렬 순서" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">내림차순</SelectItem>
                <SelectItem value="asc">오름차순</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 상품 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {productsData?.products.map((product: Product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="aspect-square relative overflow-hidden">
              <img
                src={product.images[0]?.url || '/placeholder-product.jpg'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-1">
                {product.isFeatured && (
                  <Badge variant="secondary" className="text-xs">
                    추천
                  </Badge>
                )}
                {product.isActive ? (
                  <Badge variant="default" className="text-xs">
                    활성
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="text-xs">
                    비활성
                  </Badge>
                )}
              </div>
            </div>

            <CardContent className="p-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg">
                    {formatPrice(product.price)}
                  </span>
                  {product.comparePrice &&
                    product.comparePrice !== product.price && (
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(product.comparePrice)}
                      </span>
                    )}
                </div>

                <div className="text-sm text-muted-foreground">
                  <p>SKU: {product.sku}</p>
                  <p>재고: {product.stock}개</p>
                  <p>카테고리: {formatCategoryPath(product.category)}</p>
                </div>

                <div className="flex flex-wrap gap-1">
                  {product.tags.map(tag => (
                    <Badge key={tag.id} variant="outline" className="text-xs">
                      {tag.name}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  <Link href={`/products/${product.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="w-4 h-4 mr-1" />
                      보기
                    </Button>
                  </Link>
                  <Link
                    href={`/products/${product.id}/edit`}
                    className="flex-1"
                  >
                    <Button variant="outline" size="sm" className="w-full">
                      <Edit className="w-4 h-4 mr-1" />
                      수정
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteProduct(product.id)}
                    disabled={deleteProductMutation.isPending}
                    className="flex-1"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    삭제
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 페이지네이션 */}
      {productsData && productsData.pagination.totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              이전
            </Button>

            {Array.from(
              { length: productsData.pagination.totalPages },
              (_, i) => i + 1
            ).map(pageNum => (
              <Button
                key={pageNum}
                variant={page === pageNum ? 'default' : 'outline'}
                onClick={() => setPage(pageNum)}
              >
                {pageNum}
              </Button>
            ))}

            <Button
              variant="outline"
              onClick={() => setPage(page + 1)}
              disabled={page === productsData.pagination.totalPages}
            >
              다음
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
