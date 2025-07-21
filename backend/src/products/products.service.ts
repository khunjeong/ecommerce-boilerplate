import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const { images, tags, ...productData } = createProductDto;

    // 카테고리 존재 확인
    const category = await this.prisma.category.findUnique({
      where: { id: productData.categoryId },
    });
    if (!category) {
      throw new BadRequestException('카테고리를 찾을 수 없습니다.');
    }

    // SKU 중복 확인
    if (productData.sku) {
      const existingProduct = await this.prisma.product.findUnique({
        where: { sku: productData.sku },
      });
      if (existingProduct) {
        throw new BadRequestException('이미 존재하는 SKU입니다.');
      }
    }

    // 상품 생성
    const product = await this.prisma.product.create({
      data: {
        ...productData,
        images: images
          ? {
              create: images.map((url, index) => ({
                url,
                order: index,
                isPrimary: index === 0,
              })),
            }
          : undefined,
        tags: tags
          ? {
              connectOrCreate: tags.map((tag) => ({
                where: { name: tag },
                create: { name: tag },
              })),
            }
          : undefined,
      },
      include: {
        category: true,
        images: true,
        tags: true,
        seller: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return product;
  }

  async findAll(query: QueryProductDto) {
    const {
      search,
      categoryId,
      tags,
      minPrice,
      maxPrice,
      isActive,
      isFeatured,
      sortBy,
      sortOrder,
      page,
      limit,
    } = query;

    const skip = ((page || 1) - 1) * (limit || 10);

    // 필터 조건 구성
    const where: Prisma.ProductWhereInput = {
      isActive: isActive !== undefined ? isActive : true,
      ...(isFeatured !== undefined && { isFeatured }),
      ...(categoryId && { categoryId }),
      ...(minPrice !== undefined && { price: { gte: minPrice } }),
      ...(maxPrice !== undefined && {
        price: {
          ...(minPrice !== undefined ? { gte: minPrice } : {}),
          lte: maxPrice,
        },
      }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { sku: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(tags &&
        tags.length > 0 && {
          tags: {
            some: {
              name: { in: tags },
            },
          },
        }),
    };

    // 정렬 조건 구성
    const orderBy: Prisma.ProductOrderByWithRelationInput = {};
    if (sortBy === 'price') {
      orderBy.price = sortOrder;
    } else if (sortBy === 'name') {
      orderBy.name = sortOrder;
    } else if (sortBy === 'rating') {
      orderBy.rating = sortOrder;
    } else if (sortBy === 'createdAt') {
      orderBy.createdAt = sortOrder;
    } else {
      orderBy.createdAt = 'desc';
    }

    // 상품 조회
    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          category: true,
          images: {
            orderBy: { order: 'asc' },
          },
          tags: true,
          seller: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
          _count: {
            select: {
              reviews: true,
            },
          },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / (limit || 10)),
      },
    };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: {
          orderBy: { order: 'asc' },
        },
        tags: true,
        variants: true,
        seller: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('상품을 찾을 수 없습니다.');
    }

    // 조회수 증가
    await this.prisma.product.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { images, tags, ...productData } = updateProductDto;

    // 상품 존재 확인
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!existingProduct) {
      throw new NotFoundException('상품을 찾을 수 없습니다.');
    }

    // SKU 중복 확인 (다른 상품과 중복되지 않는지)
    if (productData.sku && productData.sku !== existingProduct.sku) {
      const duplicateSku = await this.prisma.product.findUnique({
        where: { sku: productData.sku },
      });
      if (duplicateSku) {
        throw new BadRequestException('이미 존재하는 SKU입니다.');
      }
    }

    // 카테고리 존재 확인
    if (productData.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: productData.categoryId },
      });
      if (!category) {
        throw new BadRequestException('카테고리를 찾을 수 없습니다.');
      }
    }

    // 상품 업데이트
    const product = await this.prisma.product.update({
      where: { id },
      data: {
        ...productData,
        ...(images && {
          images: {
            deleteMany: {},
            create: images.map((url, index) => ({
              url,
              order: index,
              isPrimary: index === 0,
            })),
          },
        }),
        ...(tags && {
          tags: {
            set: [],
            connectOrCreate: tags.map((tag) => ({
              where: { name: tag },
              create: { name: tag },
            })),
          },
        }),
      },
      include: {
        category: true,
        images: true,
        tags: true,
        seller: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return product;
  }

  async remove(id: string) {
    // 상품 존재 확인
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!product) {
      throw new NotFoundException('상품을 찾을 수 없습니다.');
    }

    // 상품 삭제 (관련 데이터도 함께 삭제됨)
    await this.prisma.product.delete({
      where: { id },
    });

    return { message: '상품이 삭제되었습니다.' };
  }

  async findFeatured() {
    return this.prisma.product.findMany({
      where: {
        isActive: true,
        isFeatured: true,
      },
      include: {
        category: true,
        images: {
          orderBy: { order: 'asc' },
          take: 1,
        },
        tags: true,
        _count: {
          select: {
            reviews: true,
          },
        },
      },
      take: 10,
    });
  }

  async findByCategory(categoryId: string, limit: number = 10) {
    return this.prisma.product.findMany({
      where: {
        categoryId,
        isActive: true,
      },
      include: {
        category: true,
        images: {
          orderBy: { order: 'asc' },
          take: 1,
        },
        tags: true,
        _count: {
          select: {
            reviews: true,
          },
        },
      },
      take: limit,
    });
  }
}
