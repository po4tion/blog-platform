'use client'

import { useState, useTransition } from 'react'
import { Heart } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface LikeButtonProps {
  postId: string
  initialLiked: boolean
  initialCount: number
  isAuthenticated: boolean
}

export function LikeButton({
  postId,
  initialLiked,
  initialCount,
  isAuthenticated,
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialLiked)
  const [count, setCount] = useState(initialCount)
  const [isPending, startTransition] = useTransition()

  const handleToggleLike = () => {
    if (!isAuthenticated) {
      alert('좋아요를 누르려면 로그인이 필요합니다.')
      return
    }

    startTransition(async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      if (isLiked) {
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('user_id', user.id)
          .eq('post_id', postId)

        if (!error) {
          setIsLiked(false)
          setCount((prev) => prev - 1)
        }
      } else {
        const { error } = await supabase.from('likes').insert({
          user_id: user.id,
          post_id: postId,
        })

        if (!error) {
          setIsLiked(true)
          setCount((prev) => prev + 1)
        }
      }
    })
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggleLike}
      disabled={isPending}
      className={cn(
        'gap-2',
        isLiked && 'text-red-500 hover:text-red-600'
      )}
      aria-label={isLiked ? '좋아요 취소' : '좋아요'}
    >
      <Heart
        className={cn('h-5 w-5', isLiked && 'fill-current')}
      />
      <span>{count}</span>
    </Button>
  )
}
