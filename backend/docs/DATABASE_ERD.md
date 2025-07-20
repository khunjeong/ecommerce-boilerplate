# 데이터베이스 ERD (Entity Relationship Diagram)

## 개요

이 문서는 이커머스 시스템의 데이터베이스 스키마 구조를 설명합니다.

## 주요 엔티티

### 1. 사용자 관리 (User Management)

- **User**: 사용자 기본 정보
- **Account**: 소셜 로그인 계정 정보
- **SellerProfile**: 판매자 프로필 정보

### 2. 상품 관리 (Product Management)

- **Category**: 상품 카테고리 (계층 구조 지원)
- **Product**: 상품 기본 정보
- **ProductImage**: 상품 이미지
- **ProductVariant**: 상품 변형 (색상, 사이즈 등)
- **ProductTag**: 상품 태그

### 3. 주문 관리 (Order Management)

- **Order**: 주문 정보
- **OrderItem**: 주문 상품 항목
- **Payment**: 결제 정보
- **Shipping**: 배송 정보

### 4. 사용자 활동 (User Activities)

- **CartItem**: 장바구니 아이템
- **WishlistItem**: 위시리스트 아이템
- **Review**: 상품 리뷰
- **Address**: 배송지 정보

### 5. 마케팅 (Marketing)

- **Coupon**: 쿠폰 정보
- **CouponUsage**: 쿠폰 사용 내역
- **Notification**: 알림 정보

## 관계도

```
User (1) ←→ (N) Account
User (1) ←→ (1) SellerProfile
User (1) ←→ (N) Order
User (1) ←→ (N) Review
User (1) ←→ (N) CartItem
User (1) ←→ (N) WishlistItem
User (1) ←→ (N) Address

Category (1) ←→ (N) Category (self-referencing)
Category (1) ←→ (N) Product

Product (1) ←→ (N) ProductImage
Product (1) ←→ (N) ProductVariant
Product (1) ←→ (N) Review
Product (1) ←→ (N) CartItem
Product (1) ←→ (N) WishlistItem
Product (N) ←→ (N) ProductTag

Order (1) ←→ (N) OrderItem
Order (1) ←→ (N) Payment
Order (1) ←→ (1) Shipping
Order (1) ←→ (1) Address (billing)
Order (1) ←→ (1) Address (shipping)

Coupon (1) ←→ (N) CouponUsage
```

## 주요 특징

### 1. 확장성

- 계층적 카테고리 구조
- 상품 변형 시스템 (색상, 사이즈 등)
- 태그 시스템
- 소셜 로그인 지원

### 2. 유연성

- 다양한 결제 방법 지원
- 다양한 배송 방법 지원
- 쿠폰 시스템
- 알림 시스템

### 3. 데이터 무결성

- 외래 키 제약 조건
- CASCADE 삭제 설정
- UNIQUE 제약 조건
- NOT NULL 제약 조건

### 4. 성능 최적화

- 적절한 인덱싱
- 정규화된 구조
- 효율적인 쿼리 설계

## 인덱스 전략

### 주요 인덱스

1. **User.email** - 로그인 성능
2. **Product.categoryId** - 카테고리별 상품 조회
3. **Product.sku** - 상품 검색
4. **Order.userId** - 사용자별 주문 조회
5. **Order.status** - 주문 상태별 조회
6. **Payment.transactionId** - 결제 조회
7. **Review.productId** - 상품별 리뷰 조회

### 복합 인덱스

1. **CartItem(userId, productId, variantId)** - 장바구니 중복 방지
2. **WishlistItem(userId, productId)** - 위시리스트 중복 방지
3. **OrderItem(orderId, productId)** - 주문 상품 조회

## 데이터 타입

### Decimal 사용

- 가격 정보: `DECIMAL(10,2)`
- 할인율: `DECIMAL(5,2)`

### JSON 사용

- 상품 치수: `{length, width, height}`
- 결제 메타데이터: 게이트웨이별 추가 정보
- 알림 데이터: 동적 데이터

### Array 사용

- 리뷰 이미지: `String[]`
- 상품 태그: Many-to-Many 관계

## 보안 고려사항

1. **비밀번호 해싱**: bcrypt 사용
2. **JWT 토큰**: 보안 토큰 관리
3. **소셜 로그인**: OAuth 2.0 표준
4. **결제 정보**: 민감 정보 암호화
5. **API 보안**: Rate limiting, CORS 설정

## 마이그레이션 전략

1. **개발 환경**: `prisma migrate dev`
2. **스테이징 환경**: `prisma migrate deploy`
3. **프로덕션 환경**: `prisma migrate deploy`
4. **롤백**: 마이그레이션 히스토리 관리

## 모니터링

1. **쿼리 성능**: Prisma Query Logs
2. **데이터베이스 연결**: Connection Pool 모니터링
3. **마이그레이션 상태**: Migration History
4. **데이터 무결성**: Foreign Key 제약 조건
