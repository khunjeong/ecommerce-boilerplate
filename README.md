# 🛒 이커머스 보일러플레이트

현대적이고 확장 가능한 이커머스 플랫폼의 보일러플레이트입니다. Next.js 14와 NestJS 10+를 사용하여 구축되었습니다.

## 🚀 기술 스택

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod
- **Authentication**: NextAuth.js
- **Payment**: Stripe

### Backend
- **Framework**: NestJS 10+
- **Language**: TypeScript
- **Database ORM**: Prisma
- **Authentication**: JWT + Passport
- **Validation**: Class Validator + Class Transformer
- **API Documentation**: Swagger/OpenAPI
- **File Upload**: Multer + Cloudinary

### Infrastructure
- **Database**: PostgreSQL (Supabase)
- **File Storage**: Cloudinary
- **Deployment**: 
  - Frontend: Vercel
  - Backend: Railway/Render
- **Monitoring**: Sentry

## 📁 프로젝트 구조

```
├── frontend/          # Next.js 14 애플리케이션
├── backend/           # NestJS 10+ API 서버
├── shared/            # 공유 타입 및 유틸리티
├── .taskmaster/       # Task Master 설정
└── docs/              # 프로젝트 문서
```

## 🛠 설치 및 실행

### 1. 저장소 클론
```bash
git clone <repository-url>
cd task-master
pnpm install
```

### 2. Frontend 설정
```bash
cd frontend
pnpm install
pnpm run dev
```

### 3. Backend 설정
```bash
cd backend
pnpm install
pnpm run start:dev
```

### 4. 환경 변수 설정
각 디렉토리의 `.env.example` 파일을 참고하여 `.env` 파일을 생성하세요.

## 📋 주요 기능

- ✅ 사용자 인증 (이메일/소셜 로그인)
- ✅ 상품 관리 (CRUD, 이미지 업로드)
- ✅ 장바구니 및 위시리스트
- ✅ 주문 및 결제 (Stripe)
- ✅ 관리자 대시보드
- ✅ 검색 및 필터링
- ✅ 리뷰 및 평점 시스템

## 🔧 개발 가이드

### Task Master 사용
```bash
# 작업 목록 확인
task-master list

# 다음 작업 확인
task-master next

# 작업 상태 변경
task-master set-status --id=1 --status=done
```

### 코드 품질
- ESLint + Prettier 설정
- Husky + lint-staged (pre-commit 훅)
- TypeScript strict 모드
- 단위 테스트 (Jest)
- E2E 테스트 (Playwright)

## 📚 문서

- [API 문서](./docs/api.md)
- [데이터베이스 스키마](./docs/database.md)
- [배포 가이드](./docs/deployment.md)

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 📞 지원

프로젝트에 대한 질문이나 제안사항이 있으시면 [Issues](../../issues)를 통해 문의해주세요.