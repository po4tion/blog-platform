# 데이터베이스 스키마

> Supabase PostgreSQL 기반

## 목차

1. [ERD (개체-관계 다이어그램)](#erd-개체-관계-다이어그램)
2. [테이블 스키마](#테이블-스키마)
3. [인덱스](#인덱스)
4. [Row Level Security (RLS) 정책](#row-level-security-rls-정책)
5. [Functions & Triggers](#functions--triggers)
6. [마이그레이션 가이드](#마이그레이션-가이드)

---

## ERD (개체-관계 다이어그램)

```
┌─────────────┐
│ auth.users  │ (Supabase 기본 테이블)
└──────┬──────┘
       │ 1
       │
       │ 1
┌──────▼──────────┐
│   profiles      │
│                 │
│ - id (PK, FK)   │
│ - username      │
│ - display_name  │
│ - bio           │
│ - avatar_url    │
└────┬────────────┘
     │ 1
     │
     │ N
┌────▼────────────┐         ┌──────────────┐
│     posts       │ N     N │     tags     │
│                 ├─────────┤              │
│ - id (PK)       │         │ - id (PK)    │
│ - author_id(FK) │         │ - name       │
│ - title         │         │ - slug       │
│ - slug          │         └──────────────┘
│ - content       │                │
│ - published     │                │
└────┬────────────┘                │
     │ 1                           │
     │                             │
     │ N                     ┌─────▼─────────┐
┌────▼────────────┐          │  post_tags    │
│   comments      │          │               │
│                 │          │ - post_id(FK) │
│ - id (PK)       │          │ - tag_id (FK) │
│ - post_id (FK)  │          └───────────────┘
│ - author_id(FK) │
│ - content       │
│ - parent_id(FK) │
└─────────────────┘

┌─────────────────┐
│     likes       │
│                 │
│ - user_id (FK)  │
│ - post_id (FK)  │
│ - PK(user, post)│
└─────────────────┘
```

---

## 테이블 스키마

### 1. profiles

사용자 프로필 정보 (auth.users 확장)

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL CHECK (length(username) >= 3 AND length(username) <= 30),
  display_name TEXT CHECK (length(display_name) <= 50),
  bio TEXT CHECK (length(bio) <= 500),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  CONSTRAINT username_format CHECK (username ~ '^[a-zA-Z0-9_-]+$')
);

-- 자동 updated_at 업데이트
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE profiles IS '사용자 프로필 정보';
COMMENT ON COLUMN profiles.username IS '고유 사용자명 (URL에 사용)';
COMMENT ON COLUMN profiles.display_name IS '표시 이름';
COMMENT ON COLUMN profiles.bio IS '자기소개 (최대 500자)';
```

**제약 조건:**

- `username`: 3-30자, 영문/숫자/언더스코어/하이픈만 허용
- `display_name`: 최대 50자
- `bio`: 최대 500자

---

### 2. posts

블로그 게시글

```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL CHECK (length(title) >= 1 AND length(title) <= 200),
  slug TEXT UNIQUE NOT NULL CHECK (length(slug) >= 1 AND length(slug) <= 200),
  content TEXT,
  excerpt TEXT CHECK (length(excerpt) <= 500),
  cover_image_url TEXT,
  published BOOLEAN DEFAULT false NOT NULL,
  published_at TIMESTAMPTZ,
  views INTEGER DEFAULT 0 NOT NULL CHECK (views >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  CONSTRAINT slug_format CHECK (slug ~ '^[a-z0-9-]+$'),
  CONSTRAINT published_at_check CHECK (
    (published = false AND published_at IS NULL) OR
    (published = true AND published_at IS NOT NULL)
  )
);

-- 자동 updated_at 업데이트
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- published_at 자동 설정
CREATE TRIGGER set_published_at
  BEFORE INSERT OR UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION set_published_at_timestamp();

COMMENT ON TABLE posts IS '블로그 게시글';
COMMENT ON COLUMN posts.slug IS 'URL 친화적인 고유 식별자';
COMMENT ON COLUMN posts.excerpt IS '글 요약 (최대 500자)';
COMMENT ON COLUMN posts.published IS '발행 여부';
COMMENT ON COLUMN posts.published_at IS '발행 일시 (published=true일 때만)';
```

**제약 조건:**

- `title`: 1-200자
- `slug`: 소문자, 숫자, 하이픈만 허용
- `excerpt`: 최대 500자
- `views`: 0 이상
- `published_at`: published=true일 때만 값 존재

---

### 3. tags

태그 정보

```sql
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL CHECK (length(name) >= 1 AND length(name) <= 50),
  slug TEXT UNIQUE NOT NULL CHECK (length(slug) >= 1 AND length(slug) <= 50),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  CONSTRAINT slug_format CHECK (slug ~ '^[a-z0-9-]+$')
);

COMMENT ON TABLE tags IS '태그 정보';
COMMENT ON COLUMN tags.name IS '태그 표시명 (예: JavaScript)';
COMMENT ON COLUMN tags.slug IS '태그 URL 식별자 (예: javascript)';
```

**제약 조건:**

- `name`: 1-50자
- `slug`: 소문자, 숫자, 하이픈만 허용, 1-50자

---

### 4. post_tags

게시글-태그 다대다 관계

```sql
CREATE TABLE post_tags (
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  PRIMARY KEY (post_id, tag_id)
);

COMMENT ON TABLE post_tags IS '게시글-태그 연결 테이블';
```

---

### 5. comments

댓글 (대댓글 지원)

```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (length(content) >= 1 AND length(content) <= 2000),
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  CONSTRAINT no_self_parent CHECK (id != parent_id)
);

-- 자동 updated_at 업데이트
CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE comments IS '댓글 (대댓글 지원)';
COMMENT ON COLUMN comments.parent_id IS '부모 댓글 ID (대댓글인 경우)';
COMMENT ON COLUMN comments.content IS '댓글 내용 (1-2000자)';
```

**제약 조건:**

- `content`: 1-2000자
- `parent_id`: 자기 자신을 부모로 가질 수 없음

---

### 6. likes

게시글 좋아요

```sql
CREATE TABLE likes (
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  PRIMARY KEY (user_id, post_id)
);

COMMENT ON TABLE likes IS '게시글 좋아요';
```

---

## 인덱스

### profiles

```sql
CREATE INDEX idx_profiles_username ON profiles(username);
```

### posts

```sql
-- 자주 사용되는 조회 패턴
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_published ON posts(published, published_at DESC) WHERE published = true;
CREATE INDEX idx_posts_created ON posts(created_at DESC);

-- Full-text search (Phase 3)
-- CREATE INDEX idx_posts_title_content ON posts USING gin(to_tsvector('korean', title || ' ' || content));
```

### tags

```sql
CREATE INDEX idx_tags_slug ON tags(slug);
CREATE INDEX idx_tags_name ON tags(name);
```

### post_tags

```sql
CREATE INDEX idx_post_tags_post ON post_tags(post_id);
CREATE INDEX idx_post_tags_tag ON post_tags(tag_id);
```

### comments

```sql
CREATE INDEX idx_comments_post ON comments(post_id, created_at DESC);
CREATE INDEX idx_comments_author ON comments(author_id);
CREATE INDEX idx_comments_parent ON comments(parent_id) WHERE parent_id IS NOT NULL;
```

### likes

```sql
CREATE INDEX idx_likes_post ON likes(post_id);
CREATE INDEX idx_likes_user ON likes(user_id);
CREATE INDEX idx_likes_created ON likes(created_at DESC);
```

---

## Row Level Security (RLS) 정책

### profiles 테이블

```sql
-- RLS 활성화
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 프로필 조회 가능
CREATE POLICY "Profiles are viewable by everyone"
ON profiles FOR SELECT
USING (true);

-- 본인 프로필만 업데이트 가능
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 회원가입 시 프로필 생성 (Trigger로 자동 생성하므로 필요시에만)
CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);
```

---

### posts 테이블

```sql
-- RLS 활성화
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 발행된 글 + 본인 글(발행 전 포함) 조회 가능
CREATE POLICY "Published posts and own posts are viewable"
ON posts FOR SELECT
USING (
  published = true
  OR auth.uid() = author_id
);

-- 인증된 사용자는 글 작성 가능
CREATE POLICY "Authenticated users can create posts"
ON posts FOR INSERT
WITH CHECK (
  auth.uid() = author_id
);

-- 본인 글만 수정 가능
CREATE POLICY "Users can update own posts"
ON posts FOR UPDATE
USING (auth.uid() = author_id)
WITH CHECK (auth.uid() = author_id);

-- 본인 글만 삭제 가능
CREATE POLICY "Users can delete own posts"
ON posts FOR DELETE
USING (auth.uid() = author_id);
```

---

### tags 테이블

```sql
-- RLS 활성화
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 태그 조회 가능
CREATE POLICY "Tags are viewable by everyone"
ON tags FOR SELECT
USING (true);

-- 인증된 사용자는 태그 생성 가능 (자동으로 생성되므로)
CREATE POLICY "Authenticated users can create tags"
ON tags FOR INSERT
WITH CHECK (auth.role() = 'authenticated');
```

---

### post_tags 테이블

```sql
-- RLS 활성화
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 post_tags 조회 가능
CREATE POLICY "Post tags are viewable by everyone"
ON post_tags FOR SELECT
USING (true);

-- 본인 글에만 태그 추가 가능
CREATE POLICY "Users can add tags to own posts"
ON post_tags FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM posts
    WHERE posts.id = post_tags.post_id
    AND posts.author_id = auth.uid()
  )
);

-- 본인 글의 태그만 삭제 가능
CREATE POLICY "Users can delete tags from own posts"
ON post_tags FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM posts
    WHERE posts.id = post_tags.post_id
    AND posts.author_id = auth.uid()
  )
);
```

---

### comments 테이블

```sql
-- RLS 활성화
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- 발행된 글의 댓글은 모두가 조회 가능
CREATE POLICY "Comments on published posts are viewable"
ON comments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM posts
    WHERE posts.id = comments.post_id
    AND posts.published = true
  )
);

-- 인증된 사용자는 발행된 글에 댓글 작성 가능
CREATE POLICY "Authenticated users can create comments on published posts"
ON comments FOR INSERT
WITH CHECK (
  auth.uid() = author_id
  AND EXISTS (
    SELECT 1 FROM posts
    WHERE posts.id = comments.post_id
    AND posts.published = true
  )
);

-- 본인 댓글만 수정 가능
CREATE POLICY "Users can update own comments"
ON comments FOR UPDATE
USING (auth.uid() = author_id)
WITH CHECK (auth.uid() = author_id);

-- 본인 댓글만 삭제 가능
CREATE POLICY "Users can delete own comments"
ON comments FOR DELETE
USING (auth.uid() = author_id);
```

---

### likes 테이블

```sql
-- RLS 활성화
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- 좋아요 수는 모두가 조회 가능
CREATE POLICY "Likes are viewable by everyone"
ON likes FOR SELECT
USING (true);

-- 인증된 사용자는 발행된 글에 좋아요 가능
CREATE POLICY "Authenticated users can like published posts"
ON likes FOR INSERT
WITH CHECK (
  auth.uid() = user_id
  AND EXISTS (
    SELECT 1 FROM posts
    WHERE posts.id = likes.post_id
    AND posts.published = true
  )
);

-- 본인 좋아요만 취소 가능
CREATE POLICY "Users can delete own likes"
ON likes FOR DELETE
USING (auth.uid() = user_id);
```

---

## Functions & Triggers

### 1. update_updated_at_column()

`updated_at` 자동 업데이트 함수

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

### 2. set_published_at_timestamp()

`published_at` 자동 설정 함수

```sql
CREATE OR REPLACE FUNCTION set_published_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  -- published가 true로 변경되고 published_at가 NULL이면 현재 시간 설정
  IF NEW.published = true AND NEW.published_at IS NULL THEN
    NEW.published_at = NOW();
  END IF;

  -- published가 false로 변경되면 published_at를 NULL로
  IF NEW.published = false THEN
    NEW.published_at = NULL;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

### 3. handle_new_user()

회원가입 시 자동으로 profile 생성

```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'user_name', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger 생성
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
```

---

### 4. increment_post_views()

조회수 증가 함수 (RLS 우회)

```sql
CREATE OR REPLACE FUNCTION increment_post_views(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE posts
  SET views = views + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

사용 예시:

```typescript
// Client에서 호출
await supabase.rpc("increment_post_views", { post_id: "uuid" });
```

---

### 5. get_posts_with_tags()

태그를 포함한 게시글 조회 (성능 최적화)

```sql
CREATE OR REPLACE FUNCTION get_posts_with_tags(
  limit_count INTEGER DEFAULT 20,
  offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  slug TEXT,
  excerpt TEXT,
  cover_image_url TEXT,
  published_at TIMESTAMPTZ,
  views INTEGER,
  author_id UUID,
  author_username TEXT,
  author_display_name TEXT,
  author_avatar_url TEXT,
  tags JSONB,
  likes_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.title,
    p.slug,
    p.excerpt,
    p.cover_image_url,
    p.published_at,
    p.views,
    prof.id AS author_id,
    prof.username AS author_username,
    prof.display_name AS author_display_name,
    prof.avatar_url AS author_avatar_url,
    COALESCE(
      jsonb_agg(
        jsonb_build_object('id', t.id, 'name', t.name, 'slug', t.slug)
      ) FILTER (WHERE t.id IS NOT NULL),
      '[]'::jsonb
    ) AS tags,
    COUNT(l.user_id) AS likes_count
  FROM posts p
  INNER JOIN profiles prof ON p.author_id = prof.id
  LEFT JOIN post_tags pt ON p.id = pt.post_id
  LEFT JOIN tags t ON pt.tag_id = t.id
  LEFT JOIN likes l ON p.id = l.post_id
  WHERE p.published = true
  GROUP BY p.id, prof.id
  ORDER BY p.published_at DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 마이그레이션 가이드

### 초기 마이그레이션 생성

```bash
# Supabase CLI 설치 (pnpm 글로벌)
pnpm add -g supabase

# 로컬 Supabase 초기화
supabase init

# 마이그레이션 파일 생성
supabase migration new initial_schema
```

### 마이그레이션 파일 예시

**파일 위치**: `supabase/migrations/20250128000000_initial_schema.sql`

```sql
-- 1. Functions 생성
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_published_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.published = true AND NEW.published_at IS NULL THEN
    NEW.published_at = NOW();
  END IF;

  IF NEW.published = false THEN
    NEW.published_at = NULL;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'user_name', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_post_views(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE posts SET views = views + 1 WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Tables 생성
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL CHECK (length(username) >= 3 AND length(username) <= 30),
  display_name TEXT CHECK (length(display_name) <= 50),
  bio TEXT CHECK (length(bio) <= 500),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT username_format CHECK (username ~ '^[a-zA-Z0-9_-]+$')
);

CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL CHECK (length(title) >= 1 AND length(title) <= 200),
  slug TEXT UNIQUE NOT NULL CHECK (length(slug) >= 1 AND length(slug) <= 200),
  content TEXT,
  excerpt TEXT CHECK (length(excerpt) <= 500),
  cover_image_url TEXT,
  published BOOLEAN DEFAULT false NOT NULL,
  published_at TIMESTAMPTZ,
  views INTEGER DEFAULT 0 NOT NULL CHECK (views >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT slug_format CHECK (slug ~ '^[a-z0-9-]+$'),
  CONSTRAINT published_at_check CHECK (
    (published = false AND published_at IS NULL) OR
    (published = true AND published_at IS NOT NULL)
  )
);

CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL CHECK (length(name) >= 1 AND length(name) <= 50),
  slug TEXT UNIQUE NOT NULL CHECK (length(slug) >= 1 AND length(slug) <= 50),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT slug_format CHECK (slug ~ '^[a-z0-9-]+$')
);

CREATE TABLE post_tags (
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  PRIMARY KEY (post_id, tag_id)
);

CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (length(content) >= 1 AND length(content) <= 2000),
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT no_self_parent CHECK (id != parent_id)
);

CREATE TABLE likes (
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  PRIMARY KEY (user_id, post_id)
);

-- 3. Indexes 생성
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_published ON posts(published, published_at DESC) WHERE published = true;
CREATE INDEX idx_posts_created ON posts(created_at DESC);
CREATE INDEX idx_tags_slug ON tags(slug);
CREATE INDEX idx_tags_name ON tags(name);
CREATE INDEX idx_post_tags_post ON post_tags(post_id);
CREATE INDEX idx_post_tags_tag ON post_tags(tag_id);
CREATE INDEX idx_comments_post ON comments(post_id, created_at DESC);
CREATE INDEX idx_comments_author ON comments(author_id);
CREATE INDEX idx_comments_parent ON comments(parent_id) WHERE parent_id IS NOT NULL;
CREATE INDEX idx_likes_post ON likes(post_id);
CREATE INDEX idx_likes_user ON likes(user_id);
CREATE INDEX idx_likes_created ON likes(created_at DESC);

-- 4. Triggers 생성
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_published_at
  BEFORE INSERT OR UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION set_published_at_timestamp();

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- 5. RLS 활성화
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- 6. RLS 정책 생성
-- profiles
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- posts
CREATE POLICY "Published posts and own posts are viewable" ON posts FOR SELECT USING (published = true OR auth.uid() = author_id);
CREATE POLICY "Authenticated users can create posts" ON posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update own posts" ON posts FOR UPDATE USING (auth.uid() = author_id) WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can delete own posts" ON posts FOR DELETE USING (auth.uid() = author_id);

-- tags
CREATE POLICY "Tags are viewable by everyone" ON tags FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create tags" ON tags FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- post_tags
CREATE POLICY "Post tags are viewable by everyone" ON post_tags FOR SELECT USING (true);
CREATE POLICY "Users can add tags to own posts" ON post_tags FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM posts WHERE posts.id = post_tags.post_id AND posts.author_id = auth.uid())
);
CREATE POLICY "Users can delete tags from own posts" ON post_tags FOR DELETE USING (
  EXISTS (SELECT 1 FROM posts WHERE posts.id = post_tags.post_id AND posts.author_id = auth.uid())
);

-- comments
CREATE POLICY "Comments on published posts are viewable" ON comments FOR SELECT USING (
  EXISTS (SELECT 1 FROM posts WHERE posts.id = comments.post_id AND posts.published = true)
);
CREATE POLICY "Authenticated users can create comments on published posts" ON comments FOR INSERT WITH CHECK (
  auth.uid() = author_id AND EXISTS (SELECT 1 FROM posts WHERE posts.id = comments.post_id AND posts.published = true)
);
CREATE POLICY "Users can update own comments" ON comments FOR UPDATE USING (auth.uid() = author_id) WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can delete own comments" ON comments FOR DELETE USING (auth.uid() = author_id);

-- likes
CREATE POLICY "Likes are viewable by everyone" ON likes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can like published posts" ON likes FOR INSERT WITH CHECK (
  auth.uid() = user_id AND EXISTS (SELECT 1 FROM posts WHERE posts.id = likes.post_id AND posts.published = true)
);
CREATE POLICY "Users can delete own likes" ON likes FOR DELETE USING (auth.uid() = user_id);
```

### 마이그레이션 실행

```bash
# 로컬 Supabase 시작
supabase start

# 마이그레이션 적용
supabase db push

# 프로덕션에 적용
supabase db push --linked
```

### package.json 스크립트 추가

```json
{
  "scripts": {
    "db:start": "supabase start",
    "db:stop": "supabase stop",
    "db:push": "supabase db push",
    "db:pull": "supabase db pull",
    "db:reset": "supabase db reset",
    "db:migration": "supabase migration new",
    "db:types": "supabase gen types typescript --local > src/types/database.types.ts"
  }
}
```

사용 예시:

```bash
# 데이터베이스 시작
pnpm db:start

# 마이그레이션 적용
pnpm db:push

# 새 마이그레이션 생성
pnpm db:migration add_user_roles

# TypeScript 타입 생성
pnpm db:types
```

---

## Seed 데이터

**파일 위치**: `supabase/seed.sql`

```sql
-- 테스트용 태그 생성
INSERT INTO tags (name, slug) VALUES
  ('JavaScript', 'javascript'),
  ('TypeScript', 'typescript'),
  ('React', 'react'),
  ('Next.js', 'nextjs'),
  ('Node.js', 'nodejs'),
  ('PostgreSQL', 'postgresql'),
  ('Supabase', 'supabase'),
  ('Tailwind CSS', 'tailwind-css')
ON CONFLICT (slug) DO NOTHING;
```

Seed 데이터 실행:

```bash
# 로컬
supabase db reset

# 또는 직접 실행
psql -h localhost -p 54322 -U postgres -d postgres -f supabase/seed.sql
```

---

## 데이터베이스 백업

### 수동 백업

```bash
# Supabase Dashboard에서 자동 백업 제공
# Settings > Database > Backups

# 로컬 백업
supabase db dump -f backup.sql
```

### 복원

```bash
supabase db reset
psql -U postgres -d postgres -f backup.sql
```

---

## 성능 모니터링

### 슬로우 쿼리 확인

```sql
SELECT
  query,
  calls,
  total_time,
  mean_time,
  max_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

### 테이블 크기 확인

```sql
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## TypeScript 타입 생성

Supabase CLI를 사용하여 데이터베이스 스키마로부터 TypeScript 타입을 자동 생성할 수 있습니다.

```bash
# TypeScript 타입 생성 (로컬)
supabase gen types typescript --local > src/types/database.types.ts

# TypeScript 타입 생성 (프로덕션)
supabase gen types typescript --linked > src/types/database.types.ts
```

생성된 타입 사용:

```typescript
// src/types/database.types.ts 자동 생성됨
import { Database } from "@/types/database.types";

type Post = Database["public"]["Tables"]["posts"]["Row"];
type PostInsert = Database["public"]["Tables"]["posts"]["Insert"];
type PostUpdate = Database["public"]["Tables"]["posts"]["Update"];
```

---

## 트러블슈팅

### RLS 정책 디버깅

```sql
-- RLS 비활성화 (개발 중에만!)
ALTER TABLE posts DISABLE ROW LEVEL SECURITY;

-- 정책 확인
SELECT * FROM pg_policies WHERE tablename = 'posts';
```

### Foreign Key 제약 조건 에러

```sql
-- 제약 조건 확인
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY';
```

### Supabase CLI 관련

```bash
# Supabase CLI 업데이트
pnpm add -g supabase@latest

# Supabase 상태 확인
supabase status

# Supabase 로그 확인
supabase logs

# 데이터베이스 재시작
supabase db reset
```

---

## 참고 자료

- **PostgreSQL 문서**: https://www.postgresql.org/docs/
- **Supabase Database**: https://supabase.com/docs/guides/database
- **Supabase CLI**: https://supabase.com/docs/guides/cli
- **RLS 가이드**: https://supabase.com/docs/guides/auth/row-level-security
- **SQL 스타일 가이드**: https://www.sqlstyle.guide/
- **pnpm 문서**: https://pnpm.io
