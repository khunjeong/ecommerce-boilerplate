import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { AddToCartDto } from './dto/add-to-cart.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  // 장바구니 조회
  async getCart(userId: string) {
    const cartItems = await this.prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            images: {
              where: { isPrimary: true },
              take: 1,
            },
            category: true,
          },
        },
        variant: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum, item) => {
      const price = item.variant?.price || item.product.price;
      return sum + parseFloat(price.toString()) * item.quantity;
    }, 0);

    return {
      items: cartItems,
      totalItems,
      totalPrice: totalPrice.toFixed(2),
    };
  }

  // 장바구니에 상품 추가
  async addToCart(userId: string, addToCartDto: AddToCartDto) {
    const { productId, variantId, quantity } = addToCartDto;

    // 상품 존재 확인
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { variants: true },
    });

    if (!product) {
      throw new NotFoundException('상품을 찾을 수 없습니다.');
    }

    if (!product.isActive) {
      throw new BadRequestException('비활성화된 상품입니다.');
    }

    // 변형 상품인 경우 변형 확인
    if (variantId) {
      const variant = product.variants.find((v) => v.id === variantId);
      if (!variant) {
        throw new NotFoundException('상품 변형을 찾을 수 없습니다.');
      }
      if (variant.stock < quantity) {
        throw new BadRequestException('재고가 부족합니다.');
      }
    } else {
      if (product.stock < quantity) {
        throw new BadRequestException('재고가 부족합니다.');
      }
    }

    // 기존 장바구니 아이템 확인
    const existingItem = await this.prisma.cartItem.findFirst({
      where: {
        userId,
        productId,
        variantId: variantId || null,
      },
    });

    if (existingItem) {
      // 기존 아이템 수량 업데이트
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > 99) {
        throw new BadRequestException('최대 수량(99개)을 초과할 수 없습니다.');
      }

      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
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
      });
    }

    // 새 아이템 추가
    return this.prisma.cartItem.create({
      data: {
        userId,
        productId,
        variantId: variantId || null,
        quantity,
      },
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
    });
  }

  // 장바구니 아이템 수정
  async updateCartItem(
    userId: string,
    itemId: string,
    updateCartItemDto: UpdateCartItemDto,
  ) {
    const { quantity } = updateCartItemDto;

    const cartItem = await this.prisma.cartItem.findFirst({
      where: { id: itemId, userId },
      include: {
        product: true,
        variant: true,
      },
    });

    if (!cartItem) {
      throw new NotFoundException('장바구니 아이템을 찾을 수 없습니다.');
    }

    // 재고 확인
    const availableStock = cartItem.variant?.stock || cartItem.product.stock;
    if (availableStock < quantity) {
      throw new BadRequestException('재고가 부족합니다.');
    }

    return this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
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
    });
  }

  // 장바구니 아이템 삭제
  async removeFromCart(userId: string, itemId: string) {
    const cartItem = await this.prisma.cartItem.findFirst({
      where: { id: itemId, userId },
    });

    if (!cartItem) {
      throw new NotFoundException('장바구니 아이템을 찾을 수 없습니다.');
    }

    await this.prisma.cartItem.delete({
      where: { id: itemId },
    });

    return { message: '장바구니에서 제거되었습니다.' };
  }

  // 장바구니 비우기
  async clearCart(userId: string) {
    await this.prisma.cartItem.deleteMany({
      where: { userId },
    });

    return { message: '장바구니가 비워졌습니다.' };
  }
}
