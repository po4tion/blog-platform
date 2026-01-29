'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { postSchema, type PostFormData } from '@/lib/validations/post'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TiptapEditor } from '@/components/editor/tiptap-editor'

interface PostEditFormProps {
  post: {
    id: string
    title: string
    slug: string
    content: string | null
    excerpt: string | null
    cover_image_url: string | null
    published: boolean
  }
}

export function PostEditForm({ post }: PostEditFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post.title,
      content: post.content || '',
      excerpt: post.excerpt || '',
      cover_image_url: post.cover_image_url || '',
      tags: [],
    },
  })

  const onSubmit = async (data: PostFormData, publish: boolean) => {
    setIsLoading(true)
    setMessage(null)

    const supabase = createClient()

    const { error } = await supabase
      .from('posts')
      .update({
        title: data.title,
        content: data.content || null,
        excerpt: data.excerpt || null,
        cover_image_url: data.cover_image_url || null,
        published: publish,
      })
      .eq('id', post.id)

    setIsLoading(false)

    if (error) {
      setMessage({ type: 'error', text: '글 수정에 실패했습니다' })
      return
    }

    if (publish) {
      router.push(`/posts/${post.slug}`)
    } else {
      setMessage({ type: 'success', text: '임시저장되었습니다' })
    }
  }

  return (
    <form className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="cover_image_url">커버 이미지 URL</Label>
        <Input
          id="cover_image_url"
          type="url"
          placeholder="https://example.com/image.jpg"
          {...register('cover_image_url')}
        />
        {errors.cover_image_url && (
          <p className="text-destructive text-sm">{errors.cover_image_url.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">제목</Label>
        <Input
          id="title"
          placeholder="제목을 입력하세요"
          className="h-auto py-3 text-2xl font-bold"
          {...register('title')}
        />
        {errors.title && <p className="text-destructive text-sm">{errors.title.message}</p>}
        <p className="text-muted-foreground text-xs">슬러그: {post.slug} (변경 불가)</p>
      </div>

      <div className="space-y-2">
        <Label>내용</Label>
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <TiptapEditor content={field.value || ''} onChange={field.onChange} />
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">요약 (선택)</Label>
        <Input
          id="excerpt"
          placeholder="글의 요약을 입력하세요 (목록에 표시됩니다)"
          {...register('excerpt')}
        />
        {errors.excerpt && <p className="text-destructive text-sm">{errors.excerpt.message}</p>}
      </div>

      {message && (
        <p
          className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-destructive'}`}
        >
          {message.text}
        </p>
      )}

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleSubmit((data) => onSubmit(data, false))}
          disabled={isLoading}
        >
          {isLoading ? '저장 중...' : '임시저장'}
        </Button>
        <Button
          type="button"
          onClick={handleSubmit((data) => onSubmit(data, true))}
          disabled={isLoading}
        >
          {isLoading ? '발행 중...' : post.published ? '수정하기' : '발행하기'}
        </Button>
      </div>
    </form>
  )
}
