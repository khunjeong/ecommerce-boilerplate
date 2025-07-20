# 인증 시스템 문서

## 개요

이 문서는 이커머스 시스템의 인증 시스템 구현을 설명합니다.

## 구현된 기능

### 1. 사용자 관리

- **회원가입**: 이메일, 비밀번호, 이름을 통한 사용자 등록
- **사용자 조회**: 전체 사용자 목록 및 개별 사용자 정보 조회
- **사용자 수정**: 사용자 정보 업데이트
- **사용자 삭제**: 사용자 계정 삭제

### 2. 인증 시스템

- **JWT 기반 인증**: 토큰 기반 인증 시스템
- **이메일/비밀번호 로그인**: 전통적인 로그인 방식
- **비밀번호 해싱**: bcrypt를 사용한 안전한 비밀번호 저장
- **역할 기반 접근 제어**: ADMIN, CUSTOMER, SELLER 역할 지원

### 3. 보안 기능

- **가드 시스템**: JWT 및 Local 인증 가드
- **DTO 검증**: class-validator를 사용한 입력 데이터 검증
- **CORS 설정**: 크로스 오리진 요청 허용
- **환경 변수 관리**: 민감한 정보의 안전한 관리

## API 엔드포인트

### 인증 관련

```
POST /auth/register - 회원가입
POST /auth/login - 로그인
GET  /auth/profile - 사용자 프로필 조회 (인증 필요)
```

### 사용자 관리

```
GET    /users - 전체 사용자 목록 (인증 필요)
GET    /users/:id - 특정 사용자 정보 (인증 필요)
PATCH  /users/:id - 사용자 정보 수정 (인증 필요)
DELETE /users/:id - 사용자 삭제 (인증 필요)
```

## 환경 변수 설정

`.env` 파일에 다음 변수들을 설정해야 합니다:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"

# Server
PORT=3001
NODE_ENV=development
```

## 사용 예시

### 회원가입

```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "홍길동"
  }'
```

### 로그인

```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### 보호된 엔드포인트 접근

```bash
curl -X GET http://localhost:3001/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 보안 고려사항

1. **비밀번호 해싱**: bcrypt를 사용하여 비밀번호를 안전하게 저장
2. **JWT 토큰**: 만료 시간이 있는 JWT 토큰 사용
3. **입력 검증**: 모든 사용자 입력에 대한 검증 수행
4. **CORS 설정**: 적절한 CORS 설정으로 보안 강화
5. **환경 변수**: 민감한 정보는 환경 변수로 관리

## 다음 단계

1. **소셜 로그인**: Google, Facebook, Kakao 등 소셜 로그인 추가
2. **이메일 인증**: 이메일 인증 시스템 구현
3. **비밀번호 재설정**: 비밀번호 재설정 기능 추가
4. **2FA**: 2단계 인증 시스템 구현
5. **세션 관리**: 세션 기반 인증 옵션 추가
