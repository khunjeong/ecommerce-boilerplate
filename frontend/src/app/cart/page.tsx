'use client';

import { useState } from 'react';
import {
  useCart,
  useUpdateCartItem,
  useRemoveFromCart,
  useClearCart,
} from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Trash2, ShoppingCart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const { data: cart, isLoading } = useCart();
  const updateCartItemMutation = useUpdateCartItem();
  const removeFromCartMutation = useRemoveFromCart();
  const clearCartMutation = useClearCart();

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    await updateCartItemMutation.mutateAsync({
      id: itemId,
      data: { quantity: newQuantity },
    });
  };

  const handleRemoveItem = async (itemId: string) => {
    if (confirm('이 상품을 장바구니에서 제거하시겠습니까?')) {
      await removeFromCartMutation.mutateAsync(itemId);
    }
  };

  const handleClearCart = async () => {
    if (confirm('장바구니를 비우시겠습니까?')) {
      await clearCartMutation.mutateAsync();
    }
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

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">장바구니가 비어있습니다</h2>
          <p className="text-muted-foreground mb-6">
            상품을 추가하여 쇼핑을 시작해보세요.
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
          <h1 className="text-3xl font-bold">장바구니</h1>
          <p className="text-muted-foreground mt-2">
            총 {cart.totalItems}개의 상품
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleClearCart}
            disabled={clearCartMutation.isPending}
          >
            장바구니 비우기
          </Button>
          <Link href="/products">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              쇼핑 계속하기
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 장바구니 아이템 목록 */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map(item => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  {/* 상품 이미지 */}
                  <div className="w-24 h-24 flex-shrink-0">
                    <img
                      src={
                        item.product.images[0]?.url ||
                        '/placeholder-product.jpg'
                      }
                      alt={item.product.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>

                  {/* 상품 정보 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {item.product.category.name}
                        </p>
                        {item.variant && (
                          <p className="text-sm text-muted-foreground">
                            옵션: {item.variant.name} - {item.variant.value}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={removeFromCartMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">수량:</span>
                          <div className="flex items-center border rounded-md">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity - 1)
                              }
                              disabled={
                                item.quantity <= 1 ||
                                updateCartItemMutation.isPending
                              }
                              className="h-8 w-8 p-0"
                            >
                              -
                            </Button>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={e => {
                                const value = parseInt(e.target.value);
                                if (!isNaN(value) && value > 0) {
                                  handleQuantityChange(item.id, value);
                                }
                              }}
                              className="w-16 h-8 text-center border-0"
                              min="1"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity + 1)
                              }
                              disabled={updateCartItemMutation.isPending}
                              className="h-8 w-8 p-0"
                            >
                              +
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-lg">
                          {formatPrice(
                            parseFloat(
                              item.variant?.price || item.product.price
                            ) * item.quantity
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          개당{' '}
                          {formatPrice(
                            item.variant?.price || item.product.price
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 주문 요약 */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>주문 요약</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>상품 수량</span>
                <span>{cart.totalItems}개</span>
              </div>
              <div className="flex justify-between">
                <span>상품 금액</span>
                <span>{formatPrice(cart.totalPrice)}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>총 결제금액</span>
                  <span>{formatPrice(cart.totalPrice)}</span>
                </div>
              </div>
              <Button className="w-full" size="lg">
                주문하기
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
