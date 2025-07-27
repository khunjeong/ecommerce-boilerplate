import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { QueryOrderDto } from './dto/query-order.dto';
import { OrderStatus, ShippingMethod } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  // 주문 번호 생성
  private generateOrderNumber(): string {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    return `ORD-${timestamp}-${random}`;
  }

  // 배송비 계산
  private calculateShippingFee(
    method: ShippingMethod,
    subtotal: number,
  ): number {
    switch (method) {
      case 'STANDARD':
        return subtotal >= 50000 ? 0 : 3000; // 5만원 이상 무료배송
      case 'EXPRESS':
        return 5000;
      case 'SAME_DAY':
        return 8000;
      default:
        return 0;
    }
  }

  // 주문 생성
  async createOrder(userId: string, createOrderDto: CreateOrderDto) {
    const {
      items,
      shippingAddressId,
      billingAddressId,
      shippingMethod,
      notes,
    } = createOrderDto;

    // 배송지와 청구지 확인
    const [shippingAddress, billingAddress] = await Promise.all([
      this.prisma.address.findFirst({
        where: { id: shippingAddressId, userId },
      }),
      this.prisma.address.findFirst({
        where: { id: billingAddressId, userId },
      }),
    ]);

    if (!shippingAddress || !billingAddress) {
      throw new BadRequestException('배송지 또는 청구지가 존재하지 않습니다.');
    }

    // 상품 정보 조회 및 재고 확인
    const orderItems: Array<{
      productId: string;
      variantId?: string;
      quantity: number;
      price: number;
      totalPrice: number;
    }> = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
        include: { variants: true },
      });

      if (!product) {
        throw new BadRequestException(
          `상품 ${item.productId}가 존재하지 않습니다.`,
        );
      }

      let price = parseFloat(product.price.toString());
      let variant: any = null;

      if (item.variantId) {
        variant = product.variants.find((v) => v.id === item.variantId);
        if (!variant) {
          throw new BadRequestException(
            `상품 변형 ${item.variantId}가 존재하지 않습니다.`,
          );
        }
        price = parseFloat(variant.price.toString());

        if (variant.stock < item.quantity) {
          throw new BadRequestException(
            `상품 변형 ${variant.name}의 재고가 부족합니다.`,
          );
        }
      } else {
        if (product.stock < item.quantity) {
          throw new BadRequestException(
            `상품 ${product.name}의 재고가 부족합니다.`,
          );
        }
      }

      const totalPrice = price * item.quantity;
      subtotal += totalPrice;

      orderItems.push({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        price,
        totalPrice,
      });
    }

    // 배송비 계산
    const shippingAmount = this.calculateShippingFee(shippingMethod, subtotal);
    const taxAmount = subtotal * 0.1; // 10% 부가세
    const totalAmount = subtotal + shippingAmount + taxAmount;

    // 주문 생성
    const order = await this.prisma.order.create({
      data: {
        orderNumber: this.generateOrderNumber(),
        userId,
        status: OrderStatus.PENDING,
        subtotal,
        shippingAmount,
        taxAmount,
        totalAmount,
        currency: 'KRW',
        notes,
        billingAddressId,
        shippingAddressId,
        items: {
          create: orderItems.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.price,
            totalPrice: item.totalPrice,
          })),
        },
        shipping: {
          create: {
            method: shippingMethod,
            status: 'PENDING',
          },
        },
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  where: { isPrimary: true },
                  take: 1,
                },
              },
            },
            variant: true,
          },
        },
        shipping: true,
        billingAddress: true,
        shippingAddress: true,
      },
    });

    // 재고 차감
    for (const item of items) {
      if (item.variantId) {
        await this.prisma.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });
      } else {
        await this.prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }
    }

    return order;
  }

  // 주문 목록 조회
  async findAll(userId: string, query: QueryOrderDto) {
    const { status, page = 1, limit = 10, orderNumber } = query;
    const skip = (page - 1) * limit;

    const where = {
      userId,
      ...(status && { status }),
      ...(orderNumber && { orderNumber: { contains: orderNumber } }),
    };

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: {
                    where: { isPrimary: true },
                    take: 1,
                  },
                },
              },
              variant: true,
            },
          },
          shipping: true,
          billingAddress: true,
          shippingAddress: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // 주문 상세 조회
  async findOne(userId: string, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
            variant: true,
          },
        },
        shipping: true,
        payments: true,
        billingAddress: true,
        shippingAddress: true,
      },
    });

    if (!order) {
      throw new NotFoundException('주문을 찾을 수 없습니다.');
    }

    return order;
  }

  // 주문 상태 업데이트
  async updateOrder(
    userId: string,
    orderId: string,
    updateOrderDto: UpdateOrderDto,
  ) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
    });

    if (!order) {
      throw new NotFoundException('주문을 찾을 수 없습니다.');
    }

    // 주문 취소 시 재고 복구
    if (
      updateOrderDto.status === OrderStatus.CANCELLED &&
      order.status !== OrderStatus.CANCELLED
    ) {
      const orderItems = await this.prisma.orderItem.findMany({
        where: { orderId },
      });

      for (const item of orderItems) {
        if (item.variantId) {
          await this.prisma.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { increment: item.quantity } },
          });
        } else {
          await this.prisma.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }
      }
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: updateOrderDto,
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  where: { isPrimary: true },
                  take: 1,
                },
              },
            },
            variant: true,
          },
        },
        shipping: true,
        billingAddress: true,
        shippingAddress: true,
      },
    });
  }

  // 주문 취소
  async cancelOrder(userId: string, orderId: string) {
    return this.updateOrder(userId, orderId, { status: OrderStatus.CANCELLED });
  }
}
