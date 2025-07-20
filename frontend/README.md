# Task Master Frontend

Task Master 관리 시스템의 프론트엔드 애플리케이션입니다.

## 기술 스택

- **Framework**: Next.js 15.4.2
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **Form Handling**: React Hook Form + Zod
- **Icons**: Lucide React
- **HTTP Client**: Axios

## 주요 기능

- 🔐 JWT 기반 인증 시스템
- 👥 사용자 관리 (관리자, 고객, 판매자)
- 📊 대시보드 및 통계
- 📱 반응형 디자인
- ⚡ 실시간 데이터 동기화

## 시작하기

### 환경 설정

1. 환경 변수 설정:

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
```

2. 의존성 설치:

```bash
pnpm install
```

3. 개발 서버 실행:

```bash
pnpm run dev
```

4. 브라우저에서 접속:

```
http://localhost:3000
```

## 테스트 계정

- **관리자**: `admin@example.com` / `admin123`
- **일반 사용자**: `user@example.com` / `user123`
- **판매자**: `seller@example.com` / `seller123`

## 프로젝트 구조

```
src/
├── app/                 # Next.js App Router
│   ├── login/          # 로그인 페이지
│   ├── register/       # 회원가입 페이지
│   ├── dashboard/      # 대시보드 페이지
│   └── layout.tsx      # 루트 레이아웃
├── components/         # 재사용 가능한 컴포넌트
├── hooks/             # 커스텀 훅
│   └── useAuth.ts     # 인증 훅
├── lib/               # 유틸리티 및 설정
│   ├── api.ts         # API 클라이언트
│   ├── providers.tsx  # React Query Provider
│   └── utils.ts       # 유틸리티 함수
└── types/             # TypeScript 타입 정의
    └── auth.ts        # 인증 관련 타입
```

## API 연동

프론트엔드는 백엔드 API와 연동되어 있습니다:

- **인증**: 로그인, 회원가입, 프로필 조회
- **사용자 관리**: 사용자 목록, 상세 정보
- **실시간 데이터**: React Query를 통한 캐싱 및 동기화

## 개발 가이드

### 새로운 페이지 추가

1. `src/app/` 디렉토리에 새 폴더 생성
2. `page.tsx` 파일 생성
3. 필요한 경우 레이아웃 추가

### 컴포넌트 생성

1. `src/components/` 디렉토리에 컴포넌트 생성
2. TypeScript 타입 정의
3. Tailwind CSS로 스타일링

### API 호출

1. `src/lib/api.ts`에 API 함수 추가
2. React Query 훅 사용
3. 에러 처리 및 로딩 상태 관리

## 배포

### 빌드

```bash
pnpm run build
```

### 프로덕션 실행

```bash
pnpm run start
```

## 라이선스

MIT License
