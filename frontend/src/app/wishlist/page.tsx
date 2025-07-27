'use client';

import {
  useWishlist,
  useRemoveFromWishlist,
  useClearWishlist,
} from '@/hooks/useWishlist';
import { useAddToCart as useAddToCartFromCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Heart, ShoppingCart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';

export default function WishlistPage() {
  const { data: wishlist, isLoading } = useWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();
  const clearWishlistMutation = useClearWishlist();
  const addToCartMutation = useAddToCartFromCart();

  const handleRemoveItem = async (itemId: string) => {
    if (confirm('이 상품을 위시리스트에서 제거하시겠습니까?')) {
      await removeFromWishlistMutation.mutateAsync(itemId);
    }
  };

  const handleClearWishlist = async () => {
    if (confirm('위시리스트를 비우시겠습니까?')) {
      await clearWishlistMutation.mutateAsync();
    }
  };

  const handleAddToCart = async (productId: string, variantId?: string) => {
    await addToCartMutation.mutateAsync({ productId, variantId, quantity: 1 });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (!wishlist || wishlist.items.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <Heart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">위시리스트가 비어있습니다</h2>
          <p className="text-muted-foreground mb-6">
            마음에 드는 상품을 위시리스트에 추가해보세요.
          </p>
          <Link href="/products">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              상품 보러가기
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">위시리스트</h1>
          <p className="text-muted-foreground mt-2">
            총 {wishlist.totalItems}개의 상품
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleClearWishlist}
            disabled={clearWishlistMutation.isPending}
          >
            위시리스트 비우기
          </Button>
          <Link href="/products">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              쇼핑 계속하기
            </Button>
          </Link>
        </div>
      </div>

      {/* 위시리스트 아이템 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlist.items.map(item => (
          <Card key={item.id} className="overflow-hidden">
            <div className="aspect-square relative overflow-hidden">
              <img
                src={item.product.images[0]?.url || '/placeholder-product.jpg'}
                alt={item.product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-1">
                {item.product.isActive ? (
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
                  {item.product.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.product.description}
                </p>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg">
                    {formatPrice(item.variant?.price || item.product.price)}
                  </span>
                  {item.product.comparePrice &&
                    item.product.comparePrice !== item.product.price && (
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(item.product.comparePrice)}
                      </span>
                    )}
                </div>

                <div className="text-sm text-muted-foreground">
                  <p>SKU: {item.product.sku}</p>
                  <p>재고: {item.product.stock}개</p>
                  <p>카테고리: {item.product.category.name}</p>
                </div>

                {item.variant && (
                  <div className="text-sm text-muted-foreground">
                    <p>
                      옵션: {item.variant.name} - {item.variant.value}
                    </p>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleAddToCart(item.productId, item.variantId)
                    }
                    disabled={addToCartMutation.isPending}
                    className="flex-1"
                  >
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    장바구니
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={removeFromWishlistMutation.isPending}
                    className="flex-1"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    제거
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
