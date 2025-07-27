import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { AddToWishlistDto } from './dto/add-to-wishlist.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  // 위시리스트 조회
  async getWishlist(userId: string) {
    const wishlistItems = await this.prisma.wishlistItem.findMany({
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

    return {
      items: wishlistItems,
      totalItems: wishlistItems.length,
    };
  }

  // 위시리스트에 상품 추가
  async addToWishlist(userId: string, addToWishlistDto: AddToWishlistDto) {
    const { productId, variantId } = addToWishlistDto;

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
    }

    // 기존 위시리스트 아이템 확인
    const existingItem = await this.prisma.wishlistItem.findFirst({
      where: {
        userId,
        productId,
        variantId: variantId || null,
      },
    });

    if (existingItem) {
      throw new BadRequestException('이미 위시리스트에 추가된 상품입니다.');
    }

    // 새 아이템 추가
    return this.prisma.wishlistItem.create({
      data: {
        userId,
        productId,
        variantId: variantId || null,
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

  // 위시리스트에서 상품 제거
  async removeFromWishlist(userId: string, itemId: string) {
    const wishlistItem = await this.prisma.wishlistItem.findFirst({
      where: { id: itemId, userId },
    });

    if (!wishlistItem) {
      throw new NotFoundException('위시리스트 아이템을 찾을 수 없습니다.');
    }

    await this.prisma.wishlistItem.delete({
      where: { id: itemId },
    });

    return { message: '위시리스트에서 제거되었습니다.' };
  }

  // 위시리스트 비우기
  async clearWishlist(userId: string) {
    await this.prisma.wishlistItem.deleteMany({
      where: { userId },
    });

    return { message: '위시리스트가 비워졌습니다.' };
  }

  // 위시리스트에 상품이 있는지 확인
  async isInWishlist(userId: string, productId: string, variantId?: string) {
    const wishlistItem = await this.prisma.wishlistItem.findFirst({
      where: {
        userId,
        productId,
        variantId: variantId || null,
      },
    });

    return !!wishlistItem;
  }
}
