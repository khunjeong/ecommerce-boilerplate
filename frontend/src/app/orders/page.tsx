'use client';

import { useState } from 'react';
import { useOrders } from '@/hooks/useOrders';
import { useCancelOrder } from '@/hooks/useOrders';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { Search, Package, Calendar, DollarSign } from 'lucide-react';

const orderStatusMap = {
  PENDING: { label: '결제 대기', color: 'bg-yellow-100 text-yellow-800' },
  CONFIRMED: { label: '주문 확인', color: 'bg-blue-100 text-blue-800' },
  PROCESSING: { label: '처리 중', color: 'bg-purple-100 text-purple-800' },
  SHIPPED: { label: '배송 중', color: 'bg-orange-100 text-orange-800' },
  DELIVERED: { label: '배송 완료', color: 'bg-green-100 text-green-800' },
  CANCELLED: { label: '주문 취소', color: 'bg-red-100 text-red-800' },
  REFUNDED: { label: '환불 완료', color: 'bg-gray-100 text-gray-800' },
};

export default function OrdersPage() {
  const [status, setStatus] = useState<string>('');
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useOrders({
    status: (status as any) || undefined,
    orderNumber: orderNumber || undefined,
    page,
    limit: 10,
  });

  const cancelOrderMutation = useCancelOrder();

  const handleCancelOrder = (orderId: string) => {
    if (confirm('정말로 이 주문을 취소하시겠습니까?')) {
      cancelOrderMutation.mutate(orderId);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">주문 목록을 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center text-red-600">
          주문 목록을 불러오는데 실패했습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">주문 내역</h1>
      </div>

      {/* 필터 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>필터</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                주문 상태
              </label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="전체 상태" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">전체 상태</SelectItem>
                  {Object.entries(orderStatusMap).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                주문 번호
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="주문 번호 검색"
                  value={orderNumber}
                  onChange={e => setOrderNumber(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-end">
              <Button
                onClick={() => {
                  setStatus('');
                  setOrderNumber('');
                  setPage(1);
                }}
                variant="outline"
                className="w-full"
              >
                필터 초기화
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 주문 목록 */}
      {data?.orders.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              주문 내역이 없습니다
            </h3>
            <p className="text-gray-500 mb-4">첫 번째 주문을 해보세요!</p>
            <Link href="/products">
              <Button>상품 보러가기</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {data?.orders.map(order => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      주문 번호: {order.orderNumber}
                    </CardTitle>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(order.createdAt).toLocaleDateString('ko-KR')}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {formatPrice(order.totalAmount)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={orderStatusMap[order.status].color}>
                      {orderStatusMap[order.status].label}
                    </Badge>
                    {order.status === 'PENDING' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancelOrder(order.id)}
                        disabled={cancelOrderMutation.isPending}
                      >
                        취소
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {order.items.map(item => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-3 border rounded-lg"
                    >
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        {item.product.images[0] ? (
                          <img
                            src={item.product.images[0].url}
                            alt={item.product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Package className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.product.name}</h4>
                        {item.variant && (
                          <p className="text-sm text-gray-600">
                            옵션: {item.variant.name}
                          </p>
                        )}
                        <p className="text-sm text-gray-600">
                          수량: {item.quantity}개 × {formatPrice(item.price)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {formatPrice(item.totalPrice)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Link href={`/orders/${order.id}`}>
                    <Button variant="outline" className="w-full">
                      주문 상세 보기
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 페이지네이션 */}
      {data && data.pagination.pages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              이전
            </Button>
            <span className="flex items-center px-4">
              {page} / {data.pagination.pages}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage(page + 1)}
              disabled={page === data.pagination.pages}
            >
              다음
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
