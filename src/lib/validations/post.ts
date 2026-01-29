import { z } from 'zod'

export const postSchema = z.object({
  title: z.string().min(1, '제목을 입력하세요').max(200, '제목은 200자 이하여야 합니다'),
  content: z.string().optional(),
  excerpt: z.string().max(500, '요약은 500자 이하여야 합니다').optional(),
  cover_image_url: z.string().url('올바른 URL을 입력하세요').optional().or(z.literal('')),
  tags: z.array(z.string()).max(5, '태그는 최대 5개까지 추가할 수 있습니다').optional(),
})

export type PostFormData = z.infer<typeof postSchema>
