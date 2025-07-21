import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateCategoryDto } from './dto/create-category.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const { parentId, ...categoryData } = createCategoryDto;

    // 부모 카테고리 존재 확인
    if (parentId) {
      const parentCategory = await this.prisma.category.findUnique({
        where: { id: parentId },
      });
      if (!parentCategory) {
        throw new NotFoundException('부모 카테고리를 찾을 수 없습니다.');
      }
    }

    return this.prisma.category.create({
      data: categoryData,
      include: {
        parent: true,
        children: true,
      },
    });
  }

  async findAll() {
    return this.prisma.category.findMany({
      include: {
        parent: true,
        children: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
        products: {
          where: { isActive: true },
          include: {
            images: {
              orderBy: { order: 'asc' },
              take: 1,
            },
            _count: {
              select: {
                reviews: true,
              },
            },
          },
          take: 10,
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('카테고리를 찾을 수 없습니다.');
    }

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const { parentId, ...categoryData } = updateCategoryDto;

    // 카테고리 존재 확인
    const existingCategory = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!existingCategory) {
      throw new NotFoundException('카테고리를 찾을 수 없습니다.');
    }

    // 부모 카테고리 존재 확인
    if (parentId) {
      const parentCategory = await this.prisma.category.findUnique({
        where: { id: parentId },
      });
      if (!parentCategory) {
        throw new NotFoundException('부모 카테고리를 찾을 수 없습니다.');
      }

      // 자기 자신을 부모로 설정하는 것을 방지
      if (parentId === id) {
        throw new Error('자기 자신을 부모로 설정할 수 없습니다.');
      }
    }

    return this.prisma.category.update({
      where: { id },
      data: categoryData,
      include: {
        parent: true,
        children: true,
      },
    });
  }

  async remove(id: string) {
    // 카테고리 존재 확인
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        children: true,
        products: true,
      },
    });
    if (!category) {
      throw new NotFoundException('카테고리를 찾을 수 없습니다.');
    }

    // 하위 카테고리가 있거나 상품이 있는 경우 삭제 불가
    if (category.children.length > 0) {
      throw new Error('하위 카테고리가 있는 카테고리는 삭제할 수 없습니다.');
    }
    if (category.products.length > 0) {
      throw new Error('상품이 있는 카테고리는 삭제할 수 없습니다.');
    }

    await this.prisma.category.delete({
      where: { id },
    });

    return { message: '카테고리가 삭제되었습니다.' };
  }

  async findHierarchy() {
    return this.prisma.category.findMany({
      where: {
        parentId: null, // 최상위 카테고리만 조회
      },
      include: {
        children: {
          include: {
            children: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }
}
