'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { profileSchema, type ProfileFormData } from '@/lib/validations/profile'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface ProfileEditFormProps {
  profile: {
    id: string
    username: string
    display_name: string | null
    bio: string | null
    avatar_url: string | null
  }
}

export function ProfileEditForm({ profile }: ProfileEditFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: profile.username,
      display_name: profile.display_name ?? '',
      bio: profile.bio ?? '',
    },
  })

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true)
    setMessage(null)

    const supabase = createClient()

    const { error } = await supabase
      .from('profiles')
      .update({
        username: data.username,
        display_name: data.display_name || null,
        bio: data.bio || null,
      })
      .eq('id', profile.id)

    setIsLoading(false)

    if (error) {
      if (error.code === '23505') {
        setMessage({ type: 'error', text: '이미 사용 중인 사용자명입니다' })
      } else {
        setMessage({ type: 'error', text: '프로필 업데이트에 실패했습니다' })
      }
      return
    }

    setMessage({ type: 'success', text: '프로필이 업데이트되었습니다' })
  }

  const initials = (profile.display_name || profile.username)?.slice(0, 2).toUpperCase() || '??'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={profile.avatar_url ?? undefined} alt={profile.username} />
          <AvatarFallback className="text-lg">{initials}</AvatarFallback>
        </Avatar>
        <p className="text-muted-foreground text-sm">
          프로필 이미지는 GitHub 계정의 아바타를 사용합니다
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="username">사용자명</Label>
        <Input id="username" placeholder="username" {...register('username')} />
        {errors.username && <p className="text-destructive text-sm">{errors.username.message}</p>}
        <p className="text-muted-foreground text-xs">
          프로필 URL: blog-platform.com/@{profile.username}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="display_name">표시 이름</Label>
        <Input id="display_name" placeholder="홍길동" {...register('display_name')} />
        {errors.display_name && (
          <p className="text-destructive text-sm">{errors.display_name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">소개</Label>
        <Textarea id="bio" placeholder="자기소개를 입력하세요" rows={4} {...register('bio')} />
        {errors.bio && <p className="text-destructive text-sm">{errors.bio.message}</p>}
      </div>

      {message && (
        <p
          className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-destructive'}`}
        >
          {message.text}
        </p>
      )}

      <Button type="submit" disabled={isLoading}>
        {isLoading ? '저장 중...' : '저장'}
      </Button>
    </form>
  )
}
