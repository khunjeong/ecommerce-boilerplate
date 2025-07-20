import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 관리자 사용자 생성
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: '관리자',
      role: 'ADMIN',
      password: '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1m', // password: admin123
    },
  });

  // 테스트 사용자 생성
  const testUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: '테스트 사용자',
      role: 'CUSTOMER',
      password: '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1m', // password: user123
    },
  });

  // 판매자 사용자 생성
  const sellerUser = await prisma.user.upsert({
    where: { email: 'seller@example.com' },
    update: {},
    create: {
      email: 'seller@example.com',
      name: '판매자',
      role: 'SELLER',
      password: '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1m', // password: seller123
    },
  });

  // 판매자 프로필 생성
  const sellerProfile = await prisma.sellerProfile.upsert({
    where: { userId: sellerUser.id },
    update: {},
    create: {
      userId: sellerUser.id,
      companyName: '테스트 쇼핑몰',
      description: '테스트용 쇼핑몰입니다.',
      phone: '010-1234-5678',
      address: '서울시 강남구 테스트로 123',
      businessNumber: '123-45-67890',
    },
  });

  // 카테고리 생성
  const electronicsCategory = await prisma.category.upsert({
    where: { name: '전자제품' },
    update: {},
    create: {
      name: '전자제품',
      description: '다양한 전자제품을 만나보세요',
    },
  });

  const clothingCategory = await prisma.category.upsert({
    where: { name: '의류' },
    update: {},
    create: {
      name: '의류',
      description: '트렌디한 의류를 만나보세요',
    },
  });

  const bookCategory = await prisma.category.upsert({
    where: { name: '도서' },
    update: {},
    create: {
      name: '도서',
      description: '다양한 도서를 만나보세요',
    },
  });

  // 서브카테고리 생성
  const smartphoneCategory = await prisma.category.upsert({
    where: { name: '스마트폰' },
    update: {},
    create: {
      name: '스마트폰',
      description: '최신 스마트폰을 만나보세요',
      parentId: electronicsCategory.id,
    },
  });

  const laptopCategory = await prisma.category.upsert({
    where: { name: '노트북' },
    update: {},
    create: {
      name: '노트북',
      description: '강력한 성능의 노트북을 만나보세요',
      parentId: electronicsCategory.id,
    },
  });

  // 상품 생성
  const product1 = await prisma.product.upsert({
    where: { name: '테스트 스마트폰' },
    update: {},
    create: {
      name: '테스트 스마트폰',
      description: '테스트용 스마트폰입니다. 최신 기술이 적용되어 있습니다.',
      price: 800000,
      comparePrice: 900000,
      sku: 'PHONE-001',
      stock: 50,
      categoryId: smartphoneCategory.id,
      sellerId: sellerProfile.id,
    },
  });

  const product2 = await prisma.product.upsert({
    where: { name: '테스트 노트북' },
    update: {},
    create: {
      name: '테스트 노트북',
      description: '테스트용 노트북입니다. 강력한 성능을 제공합니다.',
      price: 1500000,
      comparePrice: 1700000,
      sku: 'LAPTOP-001',
      stock: 20,
      categoryId: laptopCategory.id,
      sellerId: sellerProfile.id,
    },
  });

  const product3 = await prisma.product.upsert({
    where: { name: '테스트 의류' },
    update: {},
    create: {
      name: '테스트 의류',
      description: '테스트용 의류입니다. 편안하고 스타일리시합니다.',
      price: 50000,
      comparePrice: 60000,
      sku: 'CLOTH-001',
      stock: 100,
      categoryId: clothingCategory.id,
      sellerId: sellerProfile.id,
    },
  });

  // 상품 이미지 생성
  await prisma.productImage.upsert({
    where: { id: 'img-1' },
    update: {},
    create: {
      id: 'img-1',
      productId: product1.id,
      url: 'https://via.placeholder.com/400x400?text=Smartphone',
      alt: '테스트 스마트폰 이미지',
      isPrimary: true,
    },
  });

  await prisma.productImage.upsert({
    where: { id: 'img-2' },
    update: {},
    create: {
      id: 'img-2',
      productId: product2.id,
      url: 'https://via.placeholder.com/400x400?text=Laptop',
      alt: '테스트 노트북 이미지',
      isPrimary: true,
    },
  });

  await prisma.productImage.upsert({
    where: { id: 'img-3' },
    update: {},
    create: {
      id: 'img-3',
      productId: product3.id,
      url: 'https://via.placeholder.com/400x400?text=Clothing',
      alt: '테스트 의류 이미지',
      isPrimary: true,
    },
  });

  // 상품 태그 생성
  const tag1 = await prisma.productTag.upsert({
    where: { name: '인기상품' },
    update: {},
    create: { name: '인기상품' },
  });

  const tag2 = await prisma.productTag.upsert({
    where: { name: '신상품' },
    update: {},
    create: { name: '신상품' },
  });

  const tag3 = await prisma.productTag.upsert({
    where: { name: '할인상품' },
    update: {},
    create: { name: '할인상품' },
  });

  // 상품에 태그 연결
  await prisma.product.update({
    where: { id: product1.id },
    data: {
      tags: {
        connect: [{ id: tag1.id }, { id: tag2.id }],
      },
    },
  });

  await prisma.product.update({
    where: { id: product2.id },
    data: {
      tags: {
        connect: [{ id: tag1.id }],
      },
    },
  });

  await prisma.product.update({
    where: { id: product3.id },
    data: {
      tags: {
        connect: [{ id: tag3.id }],
      },
    },
  });

  // 쿠폰 생성
  await prisma.coupon.upsert({
    where: { code: 'WELCOME10' },
    update: {},
    create: {
      code: 'WELCOME10',
      name: '신규 가입 10% 할인',
      description: '신규 가입 고객을 위한 10% 할인 쿠폰',
      type: 'PERCENTAGE',
      value: 10,
      minAmount: 10000,
      maxDiscount: 50000,
      usageLimit: 1000,
      isActive: true,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30일 후 만료
    },
  });

  await prisma.coupon.upsert({
    where: { code: 'FREESHIP' },
    update: {},
    create: {
      code: 'FREESHIP',
      name: '무료배송',
      description: '5만원 이상 구매시 무료배송',
      type: 'FREE_SHIPPING',
      value: 0,
      minAmount: 50000,
      usageLimit: 500,
      isActive: true,
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60일 후 만료
    },
  });

  console.log('✅ Database seeding completed!');
  console.log('👤 Admin user: admin@example.com (password: admin123)');
  console.log('👤 Test user: user@example.com (password: user123)');
  console.log('👤 Seller user: seller@example.com (password: seller123)');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
