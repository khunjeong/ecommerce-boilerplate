import * as bcrypt from 'bcrypt';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 시드 데이터 생성을 시작합니다...');

  // 기존 데이터 삭제 (외래키 제약 조건을 고려한 순서)
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.productTag.deleteMany();
  await prisma.user.deleteMany();

  // 사용자 생성
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: hashedPassword,
      name: '관리자',
      role: 'ADMIN',
    },
  });

  const seller = await prisma.user.create({
    data: {
      email: 'seller@example.com',
      password: hashedPassword,
      name: '판매자',
      role: 'SELLER',
    },
  });

  const customer = await prisma.user.create({
    data: {
      email: 'customer@example.com',
      password: hashedPassword,
      name: '고객',
      role: 'CUSTOMER',
    },
  });

  // 판매자 프로필 생성
  const sellerProfile = await prisma.sellerProfile.create({
    data: {
      userId: seller.id,
      companyName: '테스트 쇼핑몰',
      description: '다양한 상품을 판매하는 테스트 쇼핑몰입니다.',
      website: 'https://example.com',
      phone: '02-1234-5678',
      address: '서울시 강남구 테스트로 123',
      businessNumber: '123-45-67890',
    },
  });

  // 카테고리 생성
  const electronics = await prisma.category.create({
    data: {
      name: '전자제품',
      description: '다양한 전자제품을 만나보세요',
      image:
        'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400',
    },
  });

  const clothing = await prisma.category.create({
    data: {
      name: '의류',
      description: '트렌디한 의류를 만나보세요',
      image:
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
    },
  });

  const books = await prisma.category.create({
    data: {
      name: '도서',
      description: '다양한 도서를 만나보세요',
      image:
        'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
    },
  });

  // 하위 카테고리 생성
  const smartphone = await prisma.category.create({
    data: {
      name: '스마트폰',
      description: '최신 스마트폰을 만나보세요',
      parentId: electronics.id,
      image:
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
    },
  });

  const laptop = await prisma.category.create({
    data: {
      name: '노트북',
      description: '고성능 노트북을 만나보세요',
      parentId: electronics.id,
      image:
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
    },
  });

  const menClothing = await prisma.category.create({
    data: {
      name: '남성의류',
      description: '남성을 위한 트렌디한 의류',
      parentId: clothing.id,
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    },
  });

  const womenClothing = await prisma.category.create({
    data: {
      name: '여성의류',
      description: '여성을 위한 세련된 의류',
      parentId: clothing.id,
      image:
        'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400',
    },
  });

  // 상품 태그 생성
  const tags = await Promise.all([
    prisma.productTag.create({ data: { name: '인기상품' } }),
    prisma.productTag.create({ data: { name: '신상품' } }),
    prisma.productTag.create({ data: { name: '할인상품' } }),
    prisma.productTag.create({ data: { name: '베스트셀러' } }),
    prisma.productTag.create({ data: { name: '추천상품' } }),
  ]);

  // 상품 생성
  const products = await Promise.all([
    // 스마트폰
    prisma.product.create({
      data: {
        name: 'iPhone 15 Pro',
        description:
          '최신 iPhone 15 Pro입니다. A17 Pro 칩과 48MP 카메라를 탑재했습니다.',
        price: 1500000,
        comparePrice: 1700000,
        sku: 'IPHONE15PRO-128',
        stock: 50,
        categoryId: smartphone.id,
        sellerId: sellerProfile.id,
        isActive: true,
        isFeatured: true,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
              order: 0,
              isPrimary: true,
            },
            {
              url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
              order: 1,
              isPrimary: false,
            },
          ],
        },
        tags: {
          connect: [
            { name: '인기상품' },
            { name: '신상품' },
            { name: '베스트셀러' },
          ],
        },
      },
    }),

    // 노트북
    prisma.product.create({
      data: {
        name: 'MacBook Pro 14"',
        description: 'M3 Pro 칩을 탑재한 MacBook Pro 14인치 모델입니다.',
        price: 2800000,
        comparePrice: 3000000,
        sku: 'MBP14-M3PRO-512',
        stock: 30,
        categoryId: laptop.id,
        sellerId: sellerProfile.id,
        isActive: true,
        isFeatured: true,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
              order: 0,
              isPrimary: true,
            },
          ],
        },
        tags: {
          connect: [{ name: '인기상품' }, { name: '베스트셀러' }],
        },
      },
    }),

    // 남성의류
    prisma.product.create({
      data: {
        name: '프리미엄 셔츠',
        description: '고급스러운 면 소재로 제작된 프리미엄 셔츠입니다.',
        price: 89000,
        comparePrice: 120000,
        sku: 'SHIRT-PREM-001',
        stock: 100,
        categoryId: menClothing.id,
        sellerId: sellerProfile.id,
        isActive: true,
        isFeatured: false,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
              order: 0,
              isPrimary: true,
            },
          ],
        },
        tags: {
          connect: [{ name: '할인상품' }],
        },
      },
    }),

    // 여성의류
    prisma.product.create({
      data: {
        name: '여성 원피스',
        description: '우아하고 세련된 디자인의 여성 원피스입니다.',
        price: 120000,
        comparePrice: 150000,
        sku: 'DRESS-WOMEN-001',
        stock: 80,
        categoryId: womenClothing.id,
        sellerId: sellerProfile.id,
        isActive: true,
        isFeatured: true,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400',
              order: 0,
              isPrimary: true,
            },
          ],
        },
        tags: {
          connect: [{ name: '신상품' }, { name: '추천상품' }],
        },
      },
    }),

    // 도서
    prisma.product.create({
      data: {
        name: '프로그래밍 입문서',
        description: '초보자를 위한 프로그래밍 입문서입니다.',
        price: 25000,
        comparePrice: 30000,
        sku: 'BOOK-PROG-001',
        stock: 200,
        categoryId: books.id,
        sellerId: sellerProfile.id,
        isActive: true,
        isFeatured: false,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
              order: 0,
              isPrimary: true,
            },
          ],
        },
        tags: {
          connect: [{ name: '할인상품' }],
        },
      },
    }),
  ]);

  console.log('✅ 시드 데이터 생성이 완료되었습니다!');
  console.log(`👥 사용자: ${admin.name}, ${seller.name}, ${customer.name}`);
  console.log(
    `📂 카테고리: ${electronics.name}, ${clothing.name}, ${books.name}`,
  );
  console.log(`🏷️ 태그: ${tags.length}개`);
  console.log(`📦 상품: ${products.length}개`);
}

main()
  .catch((e) => {
    console.error('❌ 시드 데이터 생성 중 오류가 발생했습니다:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
