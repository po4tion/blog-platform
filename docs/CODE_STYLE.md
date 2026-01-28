# 코드 스타일 가이드

> 블로그 플랫폼 개발 시 준수해야 할 코딩 규칙 및 베스트 프랙티스

## 목차

1. [HTML/JSX 작성 규칙](#htmljsx-작성-규칙)
2. [접근성 (a11y)](#접근성-a11y)
3. [웹 표준](#웹-표준)
4. [TypeScript 규칙](#typescript-규칙)
5. [React 컴포넌트 규칙](#react-컴포넌트-규칙)
6. [스타일링 규칙](#스타일링-규칙)
7. [파일 및 폴더 구조](#파일-및-폴더-구조)
8. [네이밍 컨벤션](#네이밍-컨벤션)
9. [성능 최적화](#성능-최적화)
10. [보안](#보안)
11. [Git 커밋 규칙](#git-커밋-규칙)

---

## HTML/JSX 작성 규칙

### 1. 시맨틱 태그 사용 (필수)

**❌ 나쁜 예시**

```tsx
<div className="header">
  <div className="nav">
    <div className="link">홈</div>
  </div>
</div>

<div className="article">
  <div className="title">제목</div>
  <div className="content">내용</div>
</div>

<div className="footer">
  <div>저작권 정보</div>
</div>
```

**✅ 좋은 예시**

```tsx
<header>
  <nav>
    <a href="/">홈</a>
  </nav>
</header>

<article>
  <h1>제목</h1>
  <p>내용</p>
</article>

<footer>
  <p>저작권 정보</p>
</footer>
```

### 2. 시맨틱 태그 사용 가이드

#### 페이지 구조

```tsx
<body>
  <header>
    {" "}
    {/* 페이지 상단 헤더 */}
    <nav>
      {" "}
      {/* 네비게이션 메뉴 */}
      <ul>
        <li>
          <a href="/">홈</a>
        </li>
      </ul>
    </nav>
  </header>

  <main>
    {" "}
    {/* 주요 콘텐츠 */}
    <article>
      {" "}
      {/* 독립적인 콘텐츠 (블로그 글) */}
      <header>
        {" "}
        {/* 글 헤더 */}
        <h1>글 제목</h1>
        <time datetime="2025-01-20">2025년 1월 20일</time>
      </header>
      <section>
        {" "}
        {/* 글 섹션 */}
        <h2>소제목</h2>
        <p>내용...</p>
      </section>
      <footer>
        {" "}
        {/* 글 푸터 (태그, 좋아요 등) */}
        <div>태그: React, Next.js</div>
      </footer>
    </article>
    <aside>
      {" "}
      {/* 사이드바 (관련 글, 광고 등) */}
      <h2>관련 글</h2>
    </aside>
  </main>

  <footer>
    {" "}
    {/* 페이지 하단 푸터 */}
    <p>&copy; 2025 DevBlog</p>
  </footer>
</body>
```

#### 콘텐츠 태그

```tsx
// 제목 (계층 구조 유지)
<h1>페이지 제목</h1>
  <h2>섹션 제목</h2>
    <h3>하위 섹션 제목</h3>

// 텍스트
<p>문단</p>
<strong>강조 (중요)</strong>
<em>강조 (이탤릭)</em>
<mark>하이라이트</mark>
<small>작은 텍스트</small>
<del>삭제된 텍스트</del>

// 리스트
<ul>                    {/* 순서 없는 목록 */}
  <li>항목 1</li>
</ul>

<ol>                    {/* 순서 있는 목록 */}
  <li>첫 번째</li>
</ol>

// 미디어
<figure>
  <img src="..." alt="설명" />
  <figcaption>이미지 캡션</figcaption>
</figure>

// 인용
<blockquote cite="https://...">
  <p>인용 내용</p>
  <footer>— <cite>출처</cite></footer>
</blockquote>

// 코드
<pre><code>코드 블록</code></pre>
<code>인라인 코드</code>

// 날짜/시간
<time datetime="2025-01-20T10:00:00Z">
  2025년 1월 20일
</time>

// 주소
<address>
  <a href="mailto:contact@example.com">이메일</a>
</address>
```

### 3. div 사용 규칙

div는 **시맨틱 태그가 없을 때만** 사용합니다.

**사용 가능한 경우:**

- 순수 레이아웃/스타일링 목적
- Flexbox/Grid 컨테이너
- 시맨틱 의미가 없는 래퍼

```tsx
// ✅ 좋은 예시 - 레이아웃 목적
<div className="flex gap-4">
  <Button>확인</Button>
  <Button>취소</Button>
</div>

// ❌ 나쁜 예시 - 시맨틱 태그를 사용해야 함
<div className="navigation">  {/* <nav> 사용 */}
  <div className="link">      {/* <a> 사용 */}
    홈
  </div>
</div>
```

---

## 접근성 (a11y)

### 1. 기본 원칙

모든 사용자가 콘텐츠에 접근할 수 있어야 합니다:

- 키보드만으로 모든 기능 사용 가능
- 스크린 리더 사용자 고려
- 색상만으로 정보 전달 금지
- 충분한 색상 대비 (WCAG AA: 4.5:1)

### 2. 이미지 접근성

**필수: 모든 이미지에 alt 속성**

```tsx
// ✅ 좋은 예시
<Image
  src="/post-cover.jpg"
  alt="Next.js 14로 블로그 만들기 튜토리얼 커버 이미지"
  width={1200}
  height={675}
/>

// 장식용 이미지는 빈 alt
<Image
  src="/decoration.svg"
  alt=""
  width={100}
  height={100}
  aria-hidden="true"
/>

// ❌ 나쁜 예시 - alt 누락
<Image src="/image.jpg" width={100} height={100} />
```

### 3. 버튼과 링크 접근성

```tsx
// ✅ 좋은 예시 - 명확한 레이블
<Button aria-label="글 작성하기">
  <PenSquare className="w-4 h-4" />
  <span className="sr-only">글 작성하기</span>
</Button>

// 아이콘 버튼은 항상 aria-label
<Button variant="ghost" size="icon" aria-label="좋아요">
  <Heart className="w-4 h-4" />
</Button>

// 링크는 목적이 명확해야 함
<Link href="/posts/nextjs-guide" aria-label="Next.js 가이드 글 읽기">
  자세히 보기
</Link>

// ❌ 나쁜 예시
<button>              {/* 레이블 없음 */}
  <PenSquare />
</button>

<a href="/post">여기</a>  {/* 모호한 텍스트 */}
```

### 4. 폼 접근성

```tsx
// ✅ 좋은 예시 - label과 input 연결
<div>
  <label htmlFor="email" className="block mb-2">
    이메일
  </label>
  <Input
    id="email"
    type="email"
    aria-describedby="email-hint"
    aria-required="true"
  />
  <p id="email-hint" className="text-sm text-muted-foreground">
    로그인에 사용할 이메일을 입력하세요
  </p>
</div>

// 에러 메시지
<div>
  <Input
    id="password"
    type="password"
    aria-invalid={hasError}
    aria-describedby={hasError ? "password-error" : undefined}
  />
  {hasError && (
    <p id="password-error" role="alert" className="text-red-600">
      비밀번호는 8자 이상이어야 합니다
    </p>
  )}
</div>

// ❌ 나쁜 예시
<input type="email" placeholder="이메일" />  {/* label 없음 */}
```

### 5. 키보드 네비게이션

```tsx
// ✅ 좋은 예시 - 키보드 이벤트 처리
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  }}
>
  클릭 가능한 영역
</div>;

// 모달 - 포커스 트랩
import { Dialog, DialogContent } from "@/components/ui/dialog";

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    {/* shadcn/ui Dialog는 자동으로 포커스 관리 */}
    <DialogTitle>모달 제목</DialogTitle>
    <DialogDescription>내용</DialogDescription>
  </DialogContent>
</Dialog>;
```

### 6. ARIA 속성 사용

```tsx
// 역할(role) 지정
<div role="alert">중요한 알림</div>
<div role="status">로딩 중...</div>
<nav role="navigation" aria-label="주 메뉴">...</nav>

// 상태(state) 표시
<button aria-expanded={isOpen} aria-controls="menu">
  메뉴
</button>

// 라이브 영역 (동적 콘텐츠)
<div aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>

// 숨김 콘텐츠
<span className="sr-only">스크린 리더 전용 텍스트</span>
<div aria-hidden="true">장식용 요소</div>
```

### 7. 색상 대비

```tsx
// ✅ 좋은 예시 - 충분한 대비
<p className="text-gray-900 bg-white">      {/* 21:1 */}
<p className="text-gray-700 bg-white">      {/* 4.5:1 - AA 통과 */}

// ❌ 나쁜 예시 - 불충분한 대비
<p className="text-gray-400 bg-white">      {/* 2.5:1 - 실패 */}

// 링크는 색상 외에 밑줄도 사용
<a href="..." className="text-primary-600 underline underline-offset-2">
  링크 텍스트
</a>
```

### 8. Skip to Content

```tsx
// 키보드 사용자를 위한 스킵 링크
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white"
>
  본문으로 건너뛰기
</a>

<Header />

<main id="main-content" tabIndex={-1}>
  {/* 주요 콘텐츠 */}
</main>
```

---

## 웹 표준

### 1. HTML5 Doctype

```tsx
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      {" "}
      {/* 언어 명시 */}
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### 2. 메타 태그

```tsx
// app/layout.tsx 또는 페이지별 metadata
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DevBlog - 개발자 블로그",
  description: "개발 지식을 공유하는 블로그 플랫폼",

  // Open Graph (소셜 미디어)
  openGraph: {
    title: "DevBlog",
    description: "개발 지식을 공유하는 블로그 플랫폼",
    url: "https://devblog.com",
    siteName: "DevBlog",
    images: [
      {
        url: "https://devblog.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "DevBlog",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "DevBlog",
    description: "개발 지식을 공유하는 블로그 플랫폼",
    images: ["https://devblog.com/twitter-image.jpg"],
  },

  // 기타
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://devblog.com",
  },
};
```

### 3. 유효한 HTML

```tsx
// ✅ 좋은 예시 - 중첩 규칙 준수
<ul>
  <li>항목 1</li>
  <li>항목 2</li>
</ul>

<p>
  <strong>강조</strong> 텍스트
</p>

// ❌ 나쁜 예시 - 잘못된 중첩
<ul>
  <div>          {/* ul 안에는 li만 가능 */}
    <li>항목</li>
  </div>
</ul>

<p>
  <p>중첩된 문단</p>  {/* p 안에 p 불가 */}
</p>
```

### 4. 폼 유효성 검사

```tsx
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  email: z.string().email("유효한 이메일을 입력하세요"),
  password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다"),
});

export function LoginForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <Input type="email" required aria-required="true" {...form.register("email")} />
    </form>
  );
}
```

---

## TypeScript 규칙

### 1. Strict Mode 사용

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### 2. 타입 정의

```typescript
// ✅ 좋은 예시 - 명시적 타입
interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  publishedAt: string;
  tags: string[];
}

interface PostCardProps {
  post: Post;
  onLike?: () => void;
}

export function PostCard({ post, onLike }: PostCardProps) {
  // ...
}

// ❌ 나쁜 예시 - any 사용
function PostCard({ post }: { post: any }) {
  // any 금지
  // ...
}
```

### 3. 타입 파일 구조

```
src/
  types/
    post.ts         # Post 관련 타입
    user.ts         # User 관련 타입
    comment.ts      # Comment 관련 타입
    index.ts        # 타입 export
```

```typescript
// src/types/post.ts
export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  published: boolean;
  publishedAt: string;
  authorId: string;
  author: Author;
  tags: Tag[];
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostInput {
  title: string;
  content: string;
  coverImage?: string;
  tags?: string[];
}

export interface UpdatePostInput extends Partial<CreatePostInput> {
  published?: boolean;
}

// src/types/index.ts
export * from "./post";
export * from "./user";
export * from "./comment";
```

### 4. Utility Types 활용

```typescript
// Partial - 모든 속성을 선택적으로
type UpdatePost = Partial<Post>;

// Pick - 특정 속성만 선택
type PostPreview = Pick<Post, "id" | "title" | "excerpt">;

// Omit - 특정 속성 제외
type PostWithoutContent = Omit<Post, "content">;

// Record - 키-값 타입
type PostsByAuthor = Record<string, Post[]>;
```

---

## React 컴포넌트 규칙

### 1. 컴포넌트 구조

```tsx
// ✅ 좋은 예시 - 일관된 구조
"use client"; // 클라이언트 컴포넌트인 경우

import { useState } from "react"; // 1. React imports
import Image from "next/image"; // 2. Next.js imports
import { Button } from "@/components/ui/button"; // 3. 내부 imports
import { formatDate } from "@/lib/utils"; // 4. Utils
import type { Post } from "@/types"; // 5. Types

// 6. 인터페이스/타입 정의
interface PostCardProps {
  post: Post;
  onLike?: () => void;
}

// 7. 컴포넌트 함수
export function PostCard({ post, onLike }: PostCardProps) {
  // 8. Hooks
  const [isLiked, setIsLiked] = useState(false);

  // 9. 이벤트 핸들러
  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.();
  };

  // 10. JSX 반환
  return <article className="...">{/* 내용 */}</article>;
}
```

### 2. 서버/클라이언트 컴포넌트 분리

```tsx
// ✅ 서버 컴포넌트 (기본)
// app/posts/[slug]/page.tsx
import { getPost } from "@/lib/api";

export default async function PostPage({ params }) {
  const post = await getPost(params.slug); // 서버에서 데이터 페칭

  return (
    <article>
      <h1>{post.title}</h1>
      <LikeButton postId={post.id} /> {/* 클라이언트 컴포넌트 */}
    </article>
  );
}

// ✅ 클라이언트 컴포넌트
// components/like-button.tsx
("use client");

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function LikeButton({ postId }: { postId: string }) {
  const [likes, setLikes] = useState(0);

  return <Button onClick={() => setLikes(likes + 1)}>좋아요 {likes}</Button>;
}
```

### 3. Props 전달

```tsx
// ✅ 좋은 예시 - 구조분해
export function PostCard({ post, onLike, className }: PostCardProps) {
  return <div className={className}>...</div>;
}

// ❌ 나쁜 예시 - props 객체 그대로 사용
export function PostCard(props: PostCardProps) {
  return <div>{props.post.title}</div>;
}
```

### 4. 조건부 렌더링

```tsx
// ✅ 좋은 예시
{
  isLoading && <Skeleton />;
}
{
  error && <ErrorMessage error={error} />;
}
{
  posts.length > 0 ? <PostList posts={posts} /> : <EmptyState />;
}

// ❌ 나쁜 예시 - 삼항 연산자 중첩
{
  isLoading ? <Skeleton /> : error ? <ErrorMessage /> : posts.length > 0 ? <PostList /> : <EmptyState />;
}

// ✅ 개선 - Early return
if (isLoading) return <Skeleton />;
if (error) return <ErrorMessage error={error} />;
if (posts.length === 0) return <EmptyState />;

return <PostList posts={posts} />;
```

### 5. Custom Hooks

```tsx
// hooks/use-post.ts
import { useState, useEffect } from "react";
import type { Post } from "@/types";

export function usePost(slug: string) {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchPost(slug)
      .then(setPost)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, [slug]);

  return { post, isLoading, error };
}

// 사용
function PostPage({ slug }: { slug: string }) {
  const { post, isLoading, error } = usePost(slug);

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorMessage error={error} />;
  if (!post) return <NotFound />;

  return <PostDetail post={post} />;
}
```

---

## 스타일링 규칙

### 1. Tailwind CSS 사용 원칙

```tsx
// ✅ 좋은 예시 - 유틸리티 클래스
<div className="flex items-center gap-4 p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
  내용
</div>

// 조건부 클래스 - clsx 사용
import { cn } from '@/lib/utils'

<Button
  className={cn(
    "px-4 py-2",
    isActive && "bg-primary text-white",
    isDisabled && "opacity-50 cursor-not-allowed"
  )}
>
  버튼
</Button>

// ❌ 나쁜 예시 - 인라인 스타일 (특별한 이유 없이)
<div style={{ display: 'flex', padding: '24px' }}>
```

### 2. 반응형 디자인

```tsx
// Mobile-first 접근
<div
  className="
  p-4           /* 모바일: 16px */
  md:p-6        /* 태블릿: 24px */
  lg:p-8        /* 데스크톱: 32px */
  
  grid
  grid-cols-1   /* 모바일: 1컬럼 */
  md:grid-cols-2  /* 태블릿: 2컬럼 */
  2xl:grid-cols-3 /* 와이드: 3컬럼 */
  
  gap-4
  md:gap-6
"
>
  내용
</div>
```

### 3. 재사용 가능한 스타일

```tsx
// ❌ 나쁜 예시 - 반복되는 클래스
<button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-700">
<button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-700">

// ✅ 좋은 예시 - 컴포넌트화
import { Button } from '@/components/ui/button'

<Button>버튼 1</Button>
<Button>버튼 2</Button>
```

---

## 파일 및 폴더 구조

### 프로젝트 구조

```
blog-platform/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/              # Route Group - 인증
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── signup/
│   │   │       └── page.tsx
│   │   ├── (main)/              # Route Group - 메인
│   │   │   ├── page.tsx         # 홈
│   │   │   ├── posts/
│   │   │   │   ├── [slug]/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── new/
│   │   │   │       └── page.tsx
│   │   │   └── profile/
│   │   │       └── page.tsx
│   │   ├── api/                 # API Routes
│   │   │   └── posts/
│   │   │       └── route.ts
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   └── not-found.tsx
│   │
│   ├── components/              # 컴포넌트
│   │   ├── ui/                  # shadcn/ui 컴포넌트
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   └── ...
│   │   ├── post-card.tsx        # 도메인 컴포넌트
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   └── ...
│   │
│   ├── lib/                     # 유틸리티
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   └── server.ts
│   │   ├── utils.ts
│   │   └── validations.ts
│   │
│   ├── hooks/                   # Custom Hooks
│   │   ├── use-post.ts
│   │   └── use-user.ts
│   │
│   └── types/                   # TypeScript 타입
│       ├── post.ts
│       ├── user.ts
│       └── index.ts
│
├── public/                      # 정적 파일
│   ├── images/
│   └── fonts/
│
├── supabase/                    # Supabase
│   ├── migrations/
│   └── seed.sql
│
├── docs/                        # 문서
│   ├── claude.md
│   ├── DESIGN.md
│   └── CODE_STYLE.md
│
├── .env.local
├── .eslintrc.json
├── .prettierrc
├── next.config.js
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 네이밍 컨벤션

### 1. 파일명

```
# 컴포넌트 파일
post-card.tsx          ✅ kebab-case

# 유틸리티 파일
format-date.ts         ✅ kebab-case
utils.ts               ✅ kebab-case

# 타입 파일
post.ts                ✅ 단수형
user.ts                ✅ 단수형
```

### 2. 컴포넌트명

```tsx
// ✅ 좋은 예시 - PascalCase
export function PostCard() {}
export function UserProfile() {}

// ❌ 나쁜 예시
export function postCard() {} // camelCase 금지
export function post_card() {} // snake_case 금지
```

### 3. 변수/함수명

```typescript
// ✅ 좋은 예시 - camelCase
const userProfile = getUserProfile()
const isLoading = true
const hasError = false

function formatDate(date: string) {}
function handleSubmit() {}

// ❌ 나쁜 예시
const UserProfile = ...  // PascalCase는 컴포넌트/클래스용
const user_profile = ... // snake_case 금지
```

### 4. 상수

```typescript
// ✅ 좋은 예시 - UPPER_SNAKE_CASE
const MAX_TITLE_LENGTH = 100;
const API_BASE_URL = "https://api.example.com";
const DEFAULT_PAGE_SIZE = 20;

// ❌ 나쁜 예시
const maxTitleLength = 100; // 일반 변수처럼 보임
```

### 5. Boolean 변수

```typescript
// ✅ 좋은 예시 - is/has/should 접두사
const isLoading = true;
const hasError = false;
const shouldUpdate = true;
const canEdit = false;

// ❌ 나쁜 예시
const loading = true; // 동사로 오해 가능
const error = false; // 타입이 불명확
```

### 6. 이벤트 핸들러

```typescript
// ✅ 좋은 예시 - handle 접두사
function handleClick() {}
function handleSubmit() {}
function handleChange() {}

// Props로 전달 시 - on 접두사
<Button onClick={handleClick} />
<Form onSubmit={handleSubmit} />
```

---

## 성능 최적화

### 1. 이미지 최적화

```tsx
import Image from 'next/image'

// ✅ 좋은 예시
<Image
  src="/post-cover.jpg"
  alt="글 커버 이미지"
  width={1200}
  height={675}
  priority={isAboveFold}  // 스크롤 없이 보이면 priority
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
  quality={85}  // 기본 75, 품질 필요시 85
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>

// ❌ 나쁜 예시
<img src="/image.jpg" />  // HTML img 대신 Next.js Image 사용
```

### 2. Dynamic Import (코드 스플리팅)

```tsx
import dynamic from "next/dynamic";

// ✅ 좋은 예시 - 무거운 컴포넌트 lazy load
const Editor = dynamic(() => import("@/components/editor"), {
  loading: () => <Skeleton className="h-96" />,
  ssr: false, // 클라이언트에서만 렌더링
});

const Comments = dynamic(() => import("@/components/comments"), {
  loading: () => <p>댓글 로딩 중...</p>,
});

export function PostPage() {
  return (
    <>
      <PostContent />
      <Editor /> {/* 필요할 때만 로드 */}
      <Comments />
    </>
  );
}
```

### 3. React.memo 사용

```tsx
import { memo } from "react";

// ✅ 좋은 예시 - props가 변하지 않으면 리렌더링 방지
export const PostCard = memo(function PostCard({ post }: PostCardProps) {
  return (
    <Card>
      <h2>{post.title}</h2>
    </Card>
  );
});

// 복잡한 비교가 필요한 경우
export const PostCard = memo(PostCard, (prevProps, nextProps) => prevProps.post.id === nextProps.post.id);
```

### 4. useMemo / useCallback

```tsx
import { useMemo, useCallback } from "react";

export function PostList({ posts }: { posts: Post[] }) {
  // 비용이 큰 계산 - useMemo
  const sortedPosts = useMemo(() => {
    return posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }, [posts]);

  // 함수를 props로 전달 - useCallback
  const handleLike = useCallback((postId: string) => {
    // API 호출
  }, []);

  return (
    <>
      {sortedPosts.map((post) => (
        <PostCard key={post.id} post={post} onLike={handleLike} />
      ))}
    </>
  );
}
```

---

## 보안

### 1. XSS 방지

```tsx
// ✅ 안전 - React는 기본적으로 XSS 방지
<p>{userInput}</p>;

// ⚠️ 주의 - dangerouslySetInnerHTML 사용 시
import DOMPurify from "isomorphic-dompurify";

<div
  dangerouslySetInnerHTML={{
    __html: DOMPurify.sanitize(htmlContent),
  }}
/>;
```

### 2. 환경변수

```typescript
// .env.local
NEXT_PUBLIC_SUPABASE_URL=...      // 클라이언트 노출 OK
SUPABASE_SERVICE_ROLE_KEY=...     // 서버 전용 (노출 금지)

// 사용
const publicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL  // 클라이언트에서 접근 가능
const secretKey = process.env.SUPABASE_SERVICE_ROLE_KEY  // 서버에서만 접근 가능
```

### 3. 인증 확인

```typescript
// app/api/posts/route.ts
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = createClient();

  // 인증 확인
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return Response.json({ error: "인증이 필요합니다" }, { status: 401 });
  }

  // 본인 확인
  const postAuthorId = await getPostAuthorId(postId);
  if (postAuthorId !== user.id) {
    return Response.json({ error: "권한이 없습니다" }, { status: 403 });
  }

  // ...
}
```

### 4. SQL Injection 방지

```typescript
// ✅ 좋은 예시 - Parameterized query (Supabase는 기본 제공)
const { data } = await supabase.from("posts").select("*").eq("slug", slug); // 자동으로 escape

// ❌ 나쁜 예시 - Raw query (절대 금지)
const query = `SELECT * FROM posts WHERE slug = '${slug}'`;
```

---

## Git 커밋 규칙

### 1. 커밋 메시지 형식

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 2. Type

```
feat:      새로운 기능 추가
fix:       버그 수정
docs:      문서 수정
style:     코드 포맷팅 (기능 변경 없음)
refactor:  코드 리팩토링
test:      테스트 추가/수정
chore:     빌드, 설정 파일 수정
perf:      성능 개선
```

### 3. 예시

```bash
# 좋은 커밋 메시지
git commit -m "feat(post): 글 작성 기능 추가"
git commit -m "fix(auth): 로그인 시 토큰 갱신 버그 수정"
git commit -m "docs: README에 설치 가이드 추가"
git commit -m "refactor(api): API 호출 함수를 hooks로 분리"
git commit -m "style(button): Tailwind 클래스 정렬"

# 나쁜 커밋 메시지
git commit -m "수정"
git commit -m "WIP"
git commit -m "버그 고침"
```

### 4. 커밋 단위

- 하나의 커밋은 하나의 의미 있는 변경사항
- 너무 크거나 작지 않게

```bash
# ✅ 좋은 예시
git commit -m "feat(post-card): PostCard 컴포넌트 추가"
git commit -m "feat(post-card): hover 애니메이션 추가"

# ❌ 나쁜 예시
git commit -m "feat: 모든 컴포넌트 추가"  # 너무 큼
git commit -m "fix: 오타 수정"  # 너무 작음 (다른 변경사항과 합치기)
```

---

## 코드 리뷰 체크리스트

코드 작성 후 스스로 확인:

### 기본

- [ ] 시맨틱 HTML 태그 사용
- [ ] 모든 이미지에 alt 속성
- [ ] 키보드로 모든 기능 사용 가능
- [ ] 색상 대비 충분 (4.5:1 이상)
- [ ] TypeScript strict mode 통과
- [ ] ESLint 경고 없음

### 접근성

- [ ] 버튼/링크에 명확한 레이블
- [ ] 폼 input에 label 연결
- [ ] aria-\* 속성 적절히 사용
- [ ] focus indicator 보임
- [ ] skip to content 링크

### 성능

- [ ] Next.js Image 컴포넌트 사용
- [ ] 무거운 컴포넌트 dynamic import
- [ ] 불필요한 리렌더링 방지
- [ ] API 호출 최소화

### 보안

- [ ] 환경변수 올바르게 사용
- [ ] XSS 방지 (sanitize)
- [ ] 인증/권한 확인
- [ ] SQL Injection 방지

---

## 추가 도구 설정

### ESLint (.eslintrc.json)

```json
{
  "extends": [
    "next/core-web-vitals",
    "next/typescript",
    "plugin:@typescript-eslint/recommended",
    "plugin:jsx-a11y/recommended",
    "prettier"
  ],
  "plugins": ["@typescript-eslint", "jsx-a11y"],
  "rules": {
    // TypeScript 규칙
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }
    ],
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-non-null-assertion": "warn",

    // 접근성 규칙
    "jsx-a11y/anchor-is-valid": [
      "error",
      {
        "components": ["Link"],
        "specialLink": ["hrefLeft", "hrefRight"],
        "aspects": ["invalidHref", "preferButton"]
      }
    ],
    "jsx-a11y/alt-text": [
      "error",
      {
        "elements": ["img", "object", "area", "input[type=\"image\"]"],
        "img": ["Image"]
      }
    ],
    "jsx-a11y/aria-props": "error",
    "jsx-a11y/aria-role": "error",
    "jsx-a11y/click-events-have-key-events": "error",
    "jsx-a11y/no-noninteractive-element-interactions": "error",

    // React 규칙
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",

    // 일반 규칙
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "prefer-const": "error",
    "no-var": "error"
  },
  "overrides": [
    {
      "files": ["*.ts", "*.tsx"],
      "parser": "@typescript-eslint/parser",
      "parserOptions": {
        "project": "./tsconfig.json"
      }
    }
  ]
}
```

### ESLint (.eslintignore)

### Prettier (.prettierrc)

```text
node_modules
.next
out
build
dist
public
.pnpm-store
*.config.js
*.config.ts
```

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "always",
  "endOfLine": "lf",
  "plugins": ["prettier-plugin-tailwindcss"],
  "tailwindConfig": "./tailwind.config.ts",
  "tailwindFunctions": ["cn", "cva"]
}
```

### Prettier (.prettierignore)

```text
# dependencies
node_modules
.pnpm-store

# production
build
dist
.next
out

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# database
supabase/.branches
supabase/.temp
```

---

## 참고 자료

- **웹 접근성**: https://www.w3.org/WAI/WCAG21/quickref/
- **시맨틱 HTML**: https://developer.mozilla.org/ko/docs/Glossary/Semantics
- **Next.js 베스트 프랙티스**: https://nextjs.org/docs
- **React 베스트 프랙티스**: https://react.dev/learn
- **TypeScript 가이드**: https://www.typescriptlang.org/docs/

---

## Claude Code 사용 시 참고

이 문서를 참고하여 코드를 작성할 때:

```
"CODE_STYLE.md를 참고해서 PostCard 컴포넌트를 만들어주세요.
- 시맨틱 태그 (article) 사용
- 접근성 (alt, aria-label) 준수
- TypeScript strict mode
- 명확한 타입 정의"
```

모든 코드는 이 가이드를 따라 작성되어야 합니다.
