# 블로그 플랫폼 프로젝트

## 프로젝트 목적

사용자가 글을 작성하고 공유할 수 있는 프로덕션 수준의 웹 기반 블로그 플랫폼 개발

---

## 📚 관련 문서

이 프로젝트는 여러 가이드 문서로 구성되어 있습니다:

- **claude.md** (현재 문서): 프로젝트 개요, 기술 스택, 기능 로드맵, 개발 가이드
- **[docs/DATABASE.md](./docs/DATABASE.md)**: 데이터베이스 스키마, RLS 정책, Functions, Triggers, 마이그레이션
- **[docs/DESIGN.md](./docs/DESIGN.md)**: UI/UX 디자인 시스템, shadcn/ui 커스터마이징, Hashnode 스타일
- **[docs/CODE_STYLE.md](./docs/CODE_STYLE.md)**: 코딩 규칙, 시맨틱 HTML, 접근성(a11y), 웹 표준, TypeScript

**Claude Code 사용 시**:

- `claude.md`는 자동으로 읽힘
- 다른 문서는 명시적으로 참조 요청

예시:

```
"docs/DATABASE.md를 참고해서 posts 테이블 생성 마이그레이션을 만들어줘"
"docs/DESIGN.md와 docs/CODE_STYLE.md를 참고해서 PostCard 컴포넌트를 만들어줘"
```

---

## 기술 스택

모든 기술 스택은 최신 버전을 사용합니다.

### Package Manager

- **pnpm+** (빠르고 효율적인 패키지 관리)

### Frontend

- **Next.js+** (App Router)
- **TypeScript+** (strict mode)
- **Tailwind CSS+ + shadcn/ui** (최신 버전)
- **React Hook Form+** + **Zod+** (폼 관리 및 유효성 검사)
- **TanStack Query** (서버 상태 관리)

### Backend & Database

- **Supabase** (최신 버전)
  - PostgreSQL (데이터베이스)
  - Supabase Auth (GitHub OAuth)
  - Supabase Storage (이미지 업로드)
  - Row Level Security (보안)

> 📊 **데이터베이스 상세**: [docs/DATABASE.md](./docs/DATABASE.md) 참고

### 에디터

- **Tiptap+** (마크다운 에디터)
  - `@tiptap/react`
  - `@tiptap/starter-kit`
  - `@tiptap/extension-image`
  - `@tiptap/extension-link`

### 배포

- **Vercel** (프론트엔드 호스팅)
- **Supabase Cloud** (백엔드)

---

## 프로젝트 구조

```
blog-platform/
├── claude.md                   # 프로젝트 개요 (이 파일)
├── docs/                       # 프로젝트 문서
│   ├── DATABASE.md            # 데이터베이스 스키마, RLS, Functions
│   ├── DESIGN.md              # 디자인 시스템, UI 컴포넌트
│   └── CODE_STYLE.md          # 코드 스타일 가이드
│
├── src/
│   ├── app/                    # Next.js 15 App Router
│   │   ├── (auth)/            # 인증 관련 페이지
│   │   │   └── login/
│   │   │       └── page.tsx
│   │   ├── (main)/            # 메인 페이지
│   │   │   ├── page.tsx       # 홈 (글 목록)
│   │   │   ├── posts/
│   │   │   │   ├── [slug]/
│   │   │   │   │   └── page.tsx  # 글 상세
│   │   │   │   └── new/
│   │   │   │       └── page.tsx  # 글 작성
│   │   │   └── profile/
│   │   │       └── [username]/
│   │   │           └── page.tsx  # 프로필
│   │   ├── api/               # API Routes
│   │   │   └── posts/
│   │   │       └── route.ts
│   │   ├── layout.tsx
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── ui/                # shadcn/ui 컴포넌트
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   └── ...
│   │   ├── post-card.tsx      # 도메인 컴포넌트
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   └── editor.tsx
│   │
│   ├── lib/
│   │   ├── supabase/          # Supabase 클라이언트
│   │   │   ├── client.ts     # 클라이언트 측
│   │   │   ├── server.ts     # 서버 측
│   │   │   └── middleware.ts # 미들웨어
│   │   ├── utils.ts           # 유틸 함수
│   │   └── validations.ts     # Zod 스키마
│   │
│   ├── hooks/                 # Custom Hooks
│   │   ├── use-post.ts
│   │   └── use-user.ts
│   │
│   └── types/                 # TypeScript 타입
│       ├── post.ts
│       ├── user.ts
│       └── index.ts
│
├── supabase/
│   ├── migrations/            # DB 마이그레이션
│   │   └── 20250128000000_initial_schema.sql
│   └── seed.sql               # 초기 데이터
│
├── public/
│   └── images/
│
├── .env.local
├── .eslintrc.json
├── .prettierrc
├── next.config.ts
├── package.json
├── pnpm-lock.yaml             # pnpm lock file
├── .npmrc                     # pnpm 설정
├── tailwind.config.ts
├── tsconfig.json
└── components.json            # shadcn/ui 설정
```

---

## 주요 라이브러리 (최신 버전)

### package.json

```json
{
  "name": "blog-platform",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "format": "prettier --write \"**/*.{ts,tsx,md}\"",
    "db:push": "supabase db push",
    "db:pull": "supabase db pull",
    "db:reset": "supabase db reset"
  },
  "dependencies": {
    "next": "^16.1.6",
    "react": "^19.2.4",
    "react-dom": "^19.2.4",

    "@supabase/supabase-js": "^2.93.2",
    "@supabase/ssr": "^0.8.0",

    "zod": "4.3.6",
    "react-hook-form": "^7.71.1",
    "@hookform/resolvers": "^5.2.2",

    "@tanstack/react-query": "^5.90.20",

    "@radix-ui/react-avatar": "^1.1.11",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-dropdown-menu": "^2.1.16",
    "@radix-ui/react-slot": "^1.2.4",

    "lucide-react": "^0.563.0",
    "next-themes": "^0.4.6",

    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.4.0",
    "tailwindcss-animate": "^1.0.7",

    "@tiptap/react": "^3.18.0",
    "@tiptap/starter-kit": "^3.18.0",
    "@tiptap/extension-image": "^3.18.0",
    "@tiptap/extension-link": "^3.18.0",
    "@tiptap/extension-placeholder": "^3.18.0",

    "slugify": "^1.6.6",
    "date-fns": "^4.1.0",
    "react-hot-toast": "^2.6.0",
    "sanitize-html": "^2.17.0"
  },
  "devDependencies": {
    "typescript": "^5.9.3",
    "@types/node": "^25.0.10",
    "@types/react": "^19.2.10",
    "@types/react-dom": "^19.2.3",

    "tailwindcss": "^4.1.18",
    "postcss": "^8.5.6",
    "autoprefixer": "^10.4.23",

    "eslint": "^9.39.2",
    "eslint-config-next": "^16.1.6",
    "prettier": "^3.8.1",
    "prettier-plugin-tailwindcss": "^0.7.2",

    "@tailwindcss/typography": "^0.5.19",

    "supabase": "^2.72.9"
  },
  "packageManager": "pnpm@10.28.2"
}
```

### .npmrc (pnpm 설정)

```
# pnpm 설정
auto-install-peers=true
strict-peer-dependencies=false
shamefully-hoist=true

# Node.js 버전 지정
engine-strict=true
```

---

## 기능 로드맵

### Phase 1: MVP (필수 기능)

#### 인증

- [ ] GitHub OAuth 로그인 (Supabase Auth)
- [ ] 로그아웃
- [ ] 프로필 자동 생성 (Trigger)
- [ ] 프로필 편집 (username, display_name, bio, avatar)

#### 게시글 작성

- [ ] Tiptap 마크다운 에디터
- [ ] 제목, 내용, 커버 이미지
- [ ] 임시저장 (draft, published=false)
- [ ] 발행/비발행 토글
- [ ] 슬러그 자동 생성 (slugify)

#### 게시글 조회

- [ ] 홈 페이지 (최신 글 목록, 3컬럼 그리드)
- [ ] 글 상세 페이지 (Hashnode 스타일)
- [ ] 작성자 프로필 페이지

#### 게시글 관리

- [ ] 글 수정 (본인만)
- [ ] 글 삭제 (본인만)
- [ ] 조회수 카운팅 (increment_post_views Function)

---

### Phase 2: 소셜 기능

#### 댓글

- [ ] 댓글 작성/수정/삭제
- [ ] 대댓글 (중첩 댓글, parent_id)
- [ ] 댓글 작성자 표시

#### 좋아요

- [ ] 글 좋아요/좋아요 취소
- [ ] 좋아요 수 표시
- [ ] 본인이 좋아요한 글 표시

#### 태그

- [ ] 태그 추가/삭제 (글 작성 시)
- [ ] 태그별 글 필터링
- [ ] 인기 태그 표시

---

### Phase 3: 고급 기능

#### 검색 & 필터

- [ ] 글 검색 (Full-text search with pg_trgm)
- [ ] 작성자별 필터
- [ ] 정렬 (최신순, 인기순, 조회수순)
- [ ] 무한 스크롤 (TanStack Query Infinite Query)

#### SEO & 성능

- [ ] 메타태그 동적 생성 (Next.js Metadata API)
- [ ] Open Graph 이미지
- [ ] Sitemap.xml 자동 생성
- [ ] RSS 피드
- [ ] ISR (Incremental Static Regeneration)

#### 에디터 고도화

- [ ] 코드 블록 신택스 하이라이팅 (Prism.js)
- [ ] 이미지 드래그 앤 드롭
- [ ] YouTube 임베드
- [ ] 목차(TOC) 자동 생성

#### 다크모드

- [ ] 라이트/다크 테마 토글 (next-themes)
- [ ] 시스템 설정 따르기
- [ ] 테마 상태 유지 (localStorage)

---

## 환경변수 설정

### .env.local

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# GitHub OAuth는 Supabase Dashboard에서 설정
# Settings > Authentication > Providers > GitHub
# 1. GitHub에서 OAuth App 생성
# 2. Callback URL: https://your-project.supabase.co/auth/v1/callback
# 3. Client ID와 Secret을 Supabase에 등록
```

---

## 개발 가이드라인

### 코드 작성 시 참고 문서

1. **[docs/CODE_STYLE.md](./docs/CODE_STYLE.md)** - 코딩 규칙, 시맨틱 HTML, 접근성, TypeScript
2. **[docs/DESIGN.md](./docs/DESIGN.md)** - UI 컴포넌트, 색상, 타이포그래피, 레이아웃
3. **[docs/DATABASE.md](./docs/DATABASE.md)** - 데이터베이스 스키마, RLS 정책, Functions

### 기본 원칙

- **Server Components 우선**, 필요할 때만 Client Components (`'use client'`)
- **TypeScript strict mode** 준수
- **접근성(a11y)** 필수 (WCAG AA)
- **시맨틱 HTML** 사용
- **Supabase RLS**로 보안 강화
- **최신 라이브러리 버전** 사용
- **pnpm** 사용 (npm/yarn 대신)

### 커밋 컨벤션

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅 (기능 변경 없음)
refactor: 코드 리팩토링
test: 테스트 추가/수정
chore: 빌드, 설정 수정
perf: 성능 개선
```

---

## 개발 우선순위 (8주 계획)

### Week 1-2: 프로젝트 초기 설정

#### 1. pnpm 설치 (글로벌)

```bash
# Windows (PowerShell)
iwr https://get.pnpm.io/install.ps1 -useb | iex

# macOS/Linux
curl -fsSL https://get.pnpm.io/install.sh | sh -

# 설치 확인
pnpm --version  # 9.15.0+
```

#### 2. Next.js 프로젝트 생성

```bash
pnpm create next-app@latest blog-platform --typescript --tailwind --app --src-dir --import-alias "@/*"

# 프로젝트 디렉토리로 이동
cd blog-platform
```

선택 옵션:

```
✔ Would you like to use TypeScript? … Yes
✔ Would you like to use ESLint? … Yes
✔ Would you like to use Tailwind CSS? … Yes
✔ Would you like to use `src/` directory? … Yes
✔ Would you like to use App Router? … Yes
✔ Would you like to customize the default import alias? … No
```

#### 3. shadcn/ui 설정

```bash
# shadcn/ui 초기화
pnpm dlx shadcn@latest init

# 필요한 컴포넌트 설치
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add card
pnpm dlx shadcn@latest add badge
pnpm dlx shadcn@latest add avatar
pnpm dlx shadcn@latest add input
pnpm dlx shadcn@latest add textarea
pnpm dlx shadcn@latest add dropdown-menu
pnpm dlx shadcn@latest add separator
pnpm dlx shadcn@latest add skeleton
```

#### 4. 추가 패키지 설치

```bash
# Supabase
pnpm add @supabase/supabase-js @supabase/ssr

# Form & Validation
pnpm add react-hook-form @hookform/resolvers zod

# State Management
pnpm add @tanstack/react-query

# Editor
pnpm add @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link @tiptap/extension-placeholder

# Utilities
pnpm add slugify date-fns react-hot-toast sanitize-html next-themes

# DevDependencies
pnpm add -D @tailwindcss/typography prettier prettier-plugin-tailwindcss supabase
```

#### 5. .npmrc 파일 생성

```bash
echo "auto-install-peers=true
strict-peer-dependencies=false
shamefully-hoist=true
engine-strict=true" > .npmrc
```

#### 6. Supabase 설정

```bash
# Supabase CLI 글로벌 설치
pnpm add -g supabase

# Supabase 프로젝트 생성 (https://supabase.com)

# Supabase 로그인
supabase login

# 프로젝트와 연결
supabase link --project-ref your-project-ref

# 마이그레이션 실행 (docs/DATABASE.md 참고)
supabase db push
```

#### 7. 나머지 작업

- [ ] 환경변수 설정 (.env.local)
- [ ] GitHub OAuth 설정
- [ ] 프로젝트 문서 작성 (docs/ 폴더)

### Week 3-4: 인증 & 기본 CRUD

- [ ] Supabase Auth 통합
- [ ] 로그인/로그아웃 구현
- [ ] 프로필 페이지
- [ ] 글 작성 페이지 (Tiptap 에디터)
- [ ] 글 목록 페이지 (Server Component)
- [ ] 글 상세 페이지

### Week 5-6: UI/UX 개선

- [ ] shadcn/ui 컴포넌트 커스터마이징 ([docs/DESIGN.md](./docs/DESIGN.md))
- [ ] Hashnode 스타일 적용
- [ ] 반응형 디자인 (모바일/태블릿/데스크톱)
- [ ] 이미지 업로드 (Supabase Storage)
- [ ] 조회수 카운팅

### Week 7: 배포 & 테스트

- [ ] Vercel 배포 (https://vercel.com)
- [ ] 환경변수 설정 (프로덕션)
- [ ] 프로덕션 테스트
- [ ] 버그 수정
- [ ] 성능 최적화 (Lighthouse 점수 90+ 목표)

### Week 8+: Phase 2 기능

- [ ] 댓글 시스템
- [ ] 좋아요 기능
- [ ] 태그 시스템
- [ ] 다크모드

---

## Claude Code 사용 가이드

### 1. 컴포넌트 생성

```
"docs/DESIGN.md와 docs/CODE_STYLE.md를 참고해서 PostCard 컴포넌트를 만들어주세요.

요구사항:
- 파일 위치: src/components/post-card.tsx
- shadcn/ui Card 컴포넌트 사용
- Hashnode 스타일 (hover: -translate-y-1, shadow-xl)
- 16:9 커버 이미지 (Next.js Image)
- 태그 Badge 표시 (최대 3개)
- 시맨틱 HTML (article 태그)
- 접근성 준수 (alt 텍스트, aria-label)
- TypeScript 타입 명시 (src/types/post.ts)"
```

### 2. 데이터베이스 마이그레이션

```
"docs/DATABASE.md를 참고해서 초기 데이터베이스 마이그레이션 파일을 만들어주세요.

요구사항:
- 파일 위치: supabase/migrations/20250128000000_initial_schema.sql
- 모든 테이블 생성 (profiles, posts, tags, post_tags, comments, likes)
- 인덱스 생성
- RLS 정책 적용
- Functions & Triggers 포함"
```

### 3. API Route 생성

```
"docs/DATABASE.md를 참고해서 글 작성 API를 만들어주세요.

요구사항:
- 파일 위치: src/app/api/posts/route.ts
- POST 메서드
- Supabase Auth로 인증 확인
- Zod로 요청 본문 유효성 검사
- RLS 정책 적용 (본인만 작성 가능)
- TypeScript 타입 사용"
```

### 4. 페이지 생성

```
"docs/DESIGN.md를 참고해서 홈 페이지를 만들어주세요.

요구사항:
- 파일 위치: src/app/(main)/page.tsx
- Server Component로 작성
- docs/DATABASE.md의 get_posts_with_tags() Function 사용
- 3컬럼 그리드 (반응형: 모바일 1컬럼, 태블릿 2컬럼, 데스크톱 3컬럼)
- PostCard 컴포넌트 사용
- 빈 상태 처리 (글이 없을 때)
- 로딩 상태 (loading.tsx)"
```

### 5. 통합 작업

```
"claude.md, docs/DATABASE.md, docs/DESIGN.md, docs/CODE_STYLE.md를 모두 참고해서
글 상세 페이지를 만들어주세요.

요구사항:
- 파일 위치: src/app/(main)/posts/[slug]/page.tsx
- Dynamic Route (slug)
- Supabase에서 데이터 조회
- Hashnode 스타일 레이아웃
- 조회수 증가 (increment_post_views Function)
- 메타데이터 생성 (generateMetadata)
- 시맨틱 HTML
- 접근성 준수"
```

---

## 설치 및 실행

### 1. pnpm 설치

```bash
# Windows (PowerShell)
iwr https://get.pnpm.io/install.ps1 -useb | iex

# macOS/Linux
curl -fsSL https://get.pnpm.io/install.sh | sh -

# npm으로 설치 (대안)
npm install -g pnpm

# 설치 확인
pnpm --version
```

### 2. 프로젝트 클론 및 설치

```bash
git clone https://github.com/po4tion/blog-platform
cd blog-platform

# 의존성 설치
pnpm install
```

### 3. 환경변수 설정

```bash
cp .env.example .env.local
# .env.local 파일을 열어 Supabase 정보 입력
```

### 4. Supabase 설정

```bash
# Supabase CLI 글로벌 설치
pnpm add -g supabase

# Supabase 로그인
supabase login

# Supabase 프로젝트와 연결
supabase link --project-ref your-project-ref

# 마이그레이션 실행
pnpm db:push
```

### 5. 개발 서버 실행

```bash
pnpm dev
# http://localhost:3000
```

### 6. 프로덕션 빌드

```bash
pnpm build
pnpm start
```

### 7. 기타 명령어

```bash
# 린트 실행
pnpm lint

# 타입 체크
pnpm type-check

# 코드 포맷팅
pnpm format

# Supabase 마이그레이션
pnpm db:push      # 마이그레이션 적용
pnpm db:pull      # 마이그레이션 가져오기
pnpm db:reset     # 데이터베이스 리셋
```

---

## pnpm 주요 명령어

### 패키지 관리

```bash
# 패키지 설치
pnpm add <package>              # dependencies
pnpm add -D <package>           # devDependencies
pnpm add -g <package>           # 글로벌 설치

# 패키지 제거
pnpm remove <package>
pnpm remove -g <package>

# 패키지 업데이트
pnpm update                     # 모든 패키지 업데이트
pnpm update <package>           # 특정 패키지 업데이트
pnpm update --latest            # 최신 버전으로 업데이트

# 패키지 목록 확인
pnpm list                       # 설치된 패키지 목록
pnpm list --depth=0             # 최상위 패키지만
pnpm outdated                   # 오래된 패키지 확인
```

### 스크립트 실행

```bash
pnpm <script-name>              # package.json의 script 실행
pnpm dev                        # npm run dev와 동일
pnpm build                      # npm run build와 동일
```

### 유틸리티

```bash
pnpm store status               # 스토어 상태 확인
pnpm store prune                # 사용하지 않는 패키지 정리
pnpm dlx <package>              # 일회성 실행 (npx와 동일)
```

---

## pnpm vs npm/yarn 비교

| 기능          | pnpm                 | npm               | yarn          |
| ------------- | -------------------- | ----------------- | ------------- |
| 설치 속도     | ⭐⭐⭐⭐⭐ 매우 빠름 | ⭐⭐⭐ 보통       | ⭐⭐⭐⭐ 빠름 |
| 디스크 효율성 | ⭐⭐⭐⭐⭐ 최고      | ⭐⭐ 낮음         | ⭐⭐⭐ 보통   |
| 엄격한 의존성 | ✅ Yes               | ❌ No             | ❌ No         |
| Monorepo 지원 | ✅ 내장              | ⚠️ 제한적         | ✅ Workspaces |
| Lock 파일     | pnpm-lock.yaml       | package-lock.json | yarn.lock     |

### pnpm의 장점:

1. **빠른 설치 속도**: 심볼릭 링크 사용
2. **디스크 공간 절약**: 중앙 저장소에 패키지 저장 (최대 75% 절약)
3. **엄격한 의존성 관리**: phantom dependency 방지
4. **Monorepo 지원**: 기본 제공

---

## 트러블슈팅

### pnpm 관련

- **설치 오류**: `pnpm install --force` 또는 `rm -rf node_modules pnpm-lock.yaml && pnpm install`
- **권한 오류**: Windows에서는 관리자 권한, macOS/Linux에서는 `sudo` 사용
- **캐시 정리**: `pnpm store prune`

### Supabase 관련

- **RLS 정책 오류**: Supabase Dashboard > Authentication > Policies 확인
- **인증 오류**: 환경변수 확인 (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- **이미지 업로드 실패**: Storage > Policies 확인 (public 버킷 생성)

### Next.js 관련

- **Hydration 오류**: Client/Server Component 분리 확인 (`'use client'`)
- **환경변수 인식 안됨**: `NEXT_PUBLIC_` 접두사 확인, 서버 재시작
- **빌드 오류**: TypeScript 타입 에러 해결 (`pnpm type-check`)

### TypeScript 관련

- **타입 에러**: `src/types/` 폴더에 타입 정의 확인
- **Import 에러**: `tsconfig.json`의 paths 설정 확인

---

## 성능 목표

### Lighthouse 점수

- **Performance**: 90+
- **Accessibility**: 100
- **Best Practices**: 90+
- **SEO**: 100

### Core Web Vitals

- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

---

## 참고 자료

### 공식 문서

- **Next.js 15**: https://nextjs.org/docs
- **React 19**: https://react.dev
- **pnpm**: https://pnpm.io
- **Supabase**: https://supabase.com/docs
- **shadcn/ui**: https://ui.shadcn.com
- **Tailwind CSS**: https://tailwindcss.com
- **Tiptap**: https://tiptap.dev
- **TanStack Query**: https://tanstack.com/query

### 디자인 레퍼런스

- **Hashnode**: https://hashnode.com
- **Medium**: https://medium.com
- **Dev.to**: https://dev.to

### 학습 자료

- **Next.js 튜토리얼**: https://nextjs.org/learn
- **Supabase 튜토리얼**: https://supabase.com/docs/guides/getting-started
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/handbook
- **pnpm 가이드**: https://pnpm.io/motivation

---

## 라이선스

MIT License

---

## 기여

이슈 및 PR 환영합니다!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 개발 환경 설정

```bash
# 1. 레포지토리 포크 및 클론
git clone https://github.com/po4tion/blog-platform
cd blog-platform

# 2. pnpm 설치
npm install -g pnpm

# 3. 의존성 설치
pnpm install

# 4. 환경변수 설정
cp .env.example .env.local

# 5. 개발 서버 실행
pnpm dev
```
