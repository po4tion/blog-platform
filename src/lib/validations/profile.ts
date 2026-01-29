import { z } from 'zod'

export const profileSchema = z.object({
  username: z
    .string()
    .min(3, '사용자명은 3자 이상이어야 합니다')
    .max(30, '사용자명은 30자 이하여야 합니다')
    .regex(/^[a-zA-Z0-9_-]+$/, '영문, 숫자, 언더스코어(_), 하이픈(-)만 사용 가능합니다'),
  display_name: z.string().max(50, '표시 이름은 50자 이하여야 합니다').optional().or(z.literal('')),
  bio: z.string().max(500, '소개는 500자 이하여야 합니다').optional().or(z.literal('')),
})

export type ProfileFormData = z.infer<typeof profileSchema>
