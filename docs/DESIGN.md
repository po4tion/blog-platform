# 블로그 플랫폼 디자인 가이드

> Hashnode 스타일 | shadcn/ui + Tailwind CSS 기반

## 디자인 철학

- **콘텐츠 우선**: 글 읽기에 최적화된 레이아웃
- **깔끔함**: 불필요한 요소 최소화
- **전문성**: 개발자 친화적이면서도 모던한 느낌
- **가독성**: 넉넉한 여백과 큰 타이포그래피
- **접근성**: WCAG AA 준수, 키보드 네비게이션 완벽 지원

---

## 기술 스택 - UI

### Styling

- **Tailwind CS+** (유틸리티 CSS 프레임워크)
- **shadcn/ui** (복사-붙여넣기 컴포넌트 라이브러리)
- **Radix UI** (headless 컴포넌트 - shadcn이 내부적으로 사용)
- **class-variance-authority (cva)** (조건부 스타일링)
- **clsx + tailwind-merge** (클래스명 병합 유틸리티)

### 설치 순서

```bash
# 1. Next.js 프로젝트 생성
pnpm create next-app@latest blog-platform --typescript --tailwind --app --src-dir --import-alias "@/*"

# 2. shadcn/ui 초기화
pnpm dlx shadcn@latest init

# 3. 필요한 컴포넌트 설치
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add card
pnpm dlx shadcn@latest add badge
pnpm dlx shadcn@latest add avatar
pnpm dlx shadcn@latest add input
pnpm dlx shadcn@latest add textarea
pnpm dlx shadcn@latest add dropdown-menu
pnpm dlx shadcn@latest add separator
pnpm dlx shadcn@latest add skeleton
pnpm dlx shadcn@latest add dialog
```

---

## 색상 시스템

### Tailwind Config (tailwind.config.ts)

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          500: "#2563eb",
          600: "#1d4ed8",
          700: "#1e40af",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "768px",
            fontSize: "18px",
            lineHeight: "1.75",
            color: "hsl(var(--foreground))",
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};

export default config;
```

### CSS Variables (app/globals.css)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 48%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

---

## 타이포그래피

### 폰트 설정 (app/layout.tsx)

```typescript
import { Inter, JetBrains_Mono } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
```

### 폰트 스케일

```typescript
// 사용 예시
<h1 className="text-5xl font-bold">       {/* 48px */}
<h2 className="text-4xl font-bold">       {/* 36px */}
<h3 className="text-3xl font-semibold">   {/* 30px */}
<h4 className="text-2xl font-semibold">   {/* 24px */}
<p className="text-lg leading-relaxed">   {/* 18px, 글 본문 */}
<span className="text-base">             {/* 16px, 기본 */}
<span className="text-sm text-muted-foreground"> {/* 14px, 메타 정보 */}
```

---

## shadcn/ui 컴포넌트 커스터마이징

### 1. Button (Hashnode 스타일)

**파일 위치**: `src/components/ui/button.tsx`

```typescript
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary-600 text-white hover:bg-primary-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-500/30",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        link:
          "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 px-3 text-xs",
        lg: "h-12 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

**사용 예시**:

```tsx
import { Button } from "@/components/ui/button"

<Button>발행하기</Button>
<Button variant="ghost">취소</Button>
<Button variant="outline" size="sm">임시저장</Button>
```

---

### 2. Card (Hashnode 스타일)

**파일 위치**: `src/components/ui/card.tsx`

```typescript
import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border border-gray-200 bg-card text-card-foreground shadow-sm hover:border-gray-300 hover:-translate-y-1 hover:shadow-xl transition-all duration-200",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-xl font-bold leading-snug tracking-tight line-clamp-2",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-base text-muted-foreground line-clamp-3 leading-relaxed", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
```

---

### 3. Badge (태그)

**파일 위치**: `src/components/ui/badge.tsx`

```typescript
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-blue-100 text-blue-700 hover:bg-blue-200",
        secondary:
          "bg-green-100 text-green-700 hover:bg-green-200",
        destructive:
          "bg-red-100 text-red-700 hover:bg-red-200",
        outline:
          "border border-gray-300 text-gray-700 hover:bg-gray-100",
        purple:
          "bg-purple-100 text-purple-700 hover:bg-purple-200",
        orange:
          "bg-orange-100 text-orange-700 hover:bg-orange-200",
        pink:
          "bg-pink-100 text-pink-700 hover:bg-pink-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
```

**사용 예시**:

```tsx
import { Badge } from "@/components/ui/badge"

<Badge>JavaScript</Badge>
<Badge variant="secondary">React</Badge>
<Badge variant="purple">TypeScript</Badge>
```

---

### 4. Avatar

**파일 위치**: `src/components/ui/avatar.tsx`

```typescript
import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cn } from "@/lib/utils"

const Avatar = React.forwardRef
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-white",
      className
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full object-cover", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted font-semibold text-sm",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
```

---

## 주요 컴포넌트 구현 예시

### PostCard 컴포넌트 (완성본)

**파일 위치**: `src/components/post-card.tsx`

```typescript
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, Eye } from "lucide-react"

interface PostCardProps {
  post: {
    id: string
    slug: string
    title: string
    excerpt: string
    coverImage: string
    tags: string[]
    author: {
      name: string
      avatar: string
    }
    publishedAt: string
    views: number
  }
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/posts/${post.slug}`}>
      <Card className="overflow-hidden cursor-pointer group">
        {/* 커버 이미지 */}
        <div className="aspect-video relative overflow-hidden">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* 카드 내용 */}
        <CardContent className="p-6">
          {/* 태그 */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="default">
                {tag}
              </Badge>
            ))}
          </div>

          {/* 제목 */}
          <h2 className="text-xl font-bold line-clamp-2 mb-3 text-gray-900 group-hover:text-primary-600 transition-colors">
            {post.title}
          </h2>

          {/* 발췌 */}
          <p className="text-base text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
            {post.excerpt}
          </p>

          {/* 구분선 */}
          <div className="border-t border-gray-100 my-4" />

          {/* 메타 정보 */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Avatar className="w-6 h-6">
                <AvatarImage src={post.author.avatar} alt={post.author.name} />
                <AvatarFallback>{post.author.name[0]}</AvatarFallback>
              </Avatar>
              <span className="font-medium">{post.author.name}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{post.publishedAt}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{post.views}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
```

---

### Header (내비게이션)

**파일 위치**: `src/components/header.tsx`

```typescript
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, PenSquare } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* 로고 */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary-600">
            DevBlog
          </span>
        </Link>

        {/* 검색창 */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="검색..."
              className="pl-10 bg-gray-50 focus:bg-white"
            />
          </div>
        </div>

        {/* 우측 버튼들 */}
        <div className="flex items-center gap-4">
          <Link href="/write">
            <Button>
              <PenSquare className="w-4 h-4 mr-2" />
              글쓰기
            </Button>
          </Link>

          {/* 프로필 드롭다운 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="/avatar.jpg" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>내 계정</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/profile" className="w-full">프로필</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/my-posts" className="w-full">내 글</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/settings" className="w-full">설정</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                로그아웃
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
```

---

## 페이지 레이아웃 예시

### 홈 페이지 (글 목록)

**파일 위치**: `src/app/page.tsx`

```typescript
import { Header } from "@/components/header"
import { PostCard } from "@/components/post-card"

// 더미 데이터
const posts = [
  {
    id: "1",
    slug: "getting-started-with-nextjs",
    title: "Next.js 15로 블로그 만들기: 완벽 가이드",
    excerpt: "Next.js 15의 App Router를 사용하여 처음부터 블로그 플랫폼을 만들어봅니다. 서버 컴포넌트, 라우팅, 그리고 최적화 방법까지 모든 것을 다룹니다.",
    coverImage: "/images/nextjs-blog.jpg",
    tags: ["Next.js", "React", "TypeScript"],
    author: {
      name: "김개발",
      avatar: "/avatars/user1.jpg",
    },
    publishedAt: "2025년 1월 20일",
    views: 1234,
  },
  // ... 더 많은 포스트
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </main>
    </div>
  )
}
```

---

### 글 상세 페이지

**파일 위치**: `src/app/posts/[slug]/page.tsx`

```typescript
import Image from "next/image"
import { Header } from "@/components/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, Eye, Heart, Share2, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PostPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* 상단 고정 툴바 */}
      <div className="sticky top-16 z-40 border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              뒤로가기
            </Button>
          </Link>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm">
              <Heart className="w-4 h-4 mr-2" />
              좋아요
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              공유
            </Button>
          </div>
        </div>
      </div>

      {/* 본문 */}
      <article className="container mx-auto max-w-3xl px-6 py-12">
        {/* 태그 */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Badge>Next.js</Badge>
          <Badge variant="secondary">React</Badge>
          <Badge variant="purple">TypeScript</Badge>
        </div>

        {/* 제목 */}
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
          Next.js 15로 블로그 만들기: 완벽 가이드
        </h1>

        {/* 메타 정보 */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
          <div className="flex items-center gap-2">
            <Avatar className="w-10 h-10">
              <AvatarImage src="/avatars/user1.jpg" alt="김개발" />
              <AvatarFallback>김</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-gray-900">김개발</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>2025년 1월 20일</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>1,234 조회</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t border-gray-200 mb-10" />

        {/* 커버 이미지 */}
        <div className="aspect-video relative rounded-xl overflow-hidden mb-12">
          <Image
            src="/images/nextjs-blog.jpg"
            alt="Cover"
            fill
            className="object-cover"
          />
        </div>

        {/* 본문 내용 (prose) */}
        <div className="prose prose-lg max-w-none">
          <p>
            Next.js 15가 출시되면서 React 개발의 패러다임이 완전히 바뀌었습니다.
            이 글에서는 Next.js 15의 새로운 기능들을 활용하여 블로그 플랫폼을
            만드는 방법을 단계별로 알아보겠습니다.
          </p>

          <h2>1. 프로젝트 설정</h2>
          <p>
            먼저 Next.js 프로젝트를 생성합니다...
          </p>

          <pre><code>{`pnpm create next-app@latest my-blog --typescript --tailwind --app`}</code></pre>

          <h2>2. 파일 구조</h2>
          <p>
            효율적인 프로젝트 구조를 설정하는 것이 중요합니다...
          </p>

          {/* ... 더 많은 내용 */}
        </div>

        {/* 하단 액션 */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Heart className="w-4 h-4 mr-2" />
                좋아요 42
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}
```

---

## 반응형 디자인

### 브레이크포인트

```typescript
// Tailwind 기본 브레이크포인트 사용
sm: 640px   // 모바일
md: 768px   // 태블릿
lg: 1024px  // 소형 데스크톱
xl: 1280px  // 데스크톱
2xl: 1536px // 와이드
```

### 반응형 그리드 예시

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
  {/* 
    모바일: 1컬럼
    태블릿: 2컬럼
    와이드: 3컬럼
  */}
</div>
```

---

## 다크모드 설정

### next-themes 설치

```bash
pnpm add next-themes
```

### Provider 설정

**파일 위치**: `src/components/theme-provider.tsx`

```typescript
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
```

### Layout에 적용

```typescript
import { ThemeProvider } from "@/components/theme-provider"

export default function RootLayout({ children }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### 다크모드 토글 버튼

```typescript
"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
```

---

## 애니메이션

shadcn/ui는 `tailwindcss-animate`를 사용합니다.

### 사용 가능한 애니메이션

```tsx
// Fade in
<div className="animate-in fade-in duration-500">

// Slide in from bottom
<div className="animate-in slide-in-from-bottom-4 duration-300">

// Zoom in
<div className="animate-in zoom-in-50 duration-200">

// Spin (로딩)
<Loader2 className="animate-spin" />
```

---

## 접근성

shadcn/ui는 Radix UI 기반이므로 접근성이 기본으로 보장됩니다:

- ✅ 키보드 네비게이션
- ✅ ARIA 속성 자동 적용
- ✅ Focus management
- ✅ Screen reader 지원

---

## 성능 최적화

### 1. 이미지 최적화

```tsx
import Image from "next/image";

<Image
  src="/image.jpg"
  alt="Description"
  width={1200}
  height={675}
  priority // 상단 이미지는 priority
  placeholder="blur" // blur placeholder
  blurDataURL="..." // low-quality placeholder
/>;
```

### 2. 폰트 최적화

```typescript
// next/font를 사용하면 자동으로 최적화됨
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap", // FOUT 방지
  preload: true,
});
```

### 3. 컴포넌트 lazy loading

```tsx
import dynamic from "next/dynamic";

const Comments = dynamic(() => import("@/components/comments"), {
  loading: () => <Skeleton className="h-48" />,
  ssr: false,
});
```

---

## 개발 체크리스트

### Phase 1: 초기 설정

- [ ] Next.js 프로젝트 생성 (`pnpm create next-app`)
- [ ] shadcn/ui 초기화 (`pnpm dlx shadcn@latest init`)
- [ ] 필요한 컴포넌트 설치
- [ ] Tailwind config 설정
- [ ] 폰트 설정 (Inter, JetBrains Mono)
- [ ] 다크모드 설정 (`pnpm add next-themes`)

### Phase 2: 컴포넌트 개발

- [ ] PostCard 컴포넌트
- [ ] Header 컴포넌트
- [ ] Footer 컴포넌트
- [ ] Button 커스터마이징
- [ ] Badge 커스터마이징
- [ ] Card 커스터마이징

### Phase 3: 페이지 개발

- [ ] 홈 페이지 (글 목록)
- [ ] 글 상세 페이지
- [ ] 글 작성 페이지
- [ ] 프로필 페이지

---

## 추가 패키지 설치

### UI 관련 패키지

```bash
# 아이콘
pnpm add lucide-react

# 다크모드
pnpm add next-themes

# 클래스명 유틸리티
pnpm add clsx tailwind-merge class-variance-authority

# 애니메이션
pnpm add tailwindcss-animate

# Typography
pnpm add -D @tailwindcss/typography
```

---

## 참고 자료

- **shadcn/ui 공식 문서**: https://ui.shadcn.com
- **Tailwind CSS 문서**: https://tailwindcss.com
- **Radix UI 문서**: https://www.radix-ui.com
- **Next.js 문서**: https://nextjs.org
- **pnpm 문서**: https://pnpm.io

---

## Claude Code 사용 팁

### 컴포넌트 생성 요청

```
"docs/DESIGN.md를 참고해서 PostCard 컴포넌트를 만들어주세요.
- shadcn/ui Card 사용
- Hashnode 스타일 hover 효과
- 16:9 커버 이미지
- Badge로 태그 표시"
```

### 페이지 생성 요청

```
"docs/DESIGN.md의 홈 페이지 레이아웃대로 page.tsx를 만들어주세요.
- shadcn/ui 컴포넌트 사용
- 3컬럼 그리드 (반응형)
- 더미 데이터 6개"
```

### 커스터마이징 요청

```
"shadcn/ui Button 컴포넌트를 docs/DESIGN.md의 Hashnode 스타일로 수정해주세요.
- hover 시 -translate-y-0.5
- shadow-lg 효과 추가"
```
