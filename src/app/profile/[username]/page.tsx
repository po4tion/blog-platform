import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

interface ProfilePageProps {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { username } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, display_name, bio')
    .eq('username', username)
    .single()

  if (!profile) {
    return { title: '프로필을 찾을 수 없음 | Blog Platform' }
  }

  const displayName = profile.display_name || profile.username

  return {
    title: `${displayName} | Blog Platform`,
    description: profile.bio || `${displayName}의 프로필`,
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, username, display_name, bio, avatar_url, created_at')
    .eq('username', username)
    .single()

  if (!profile) {
    notFound()
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isOwnProfile = user?.id === profile.id
  const displayName = profile.display_name || profile.username
  const initials = displayName.slice(0, 2).toUpperCase()
  const joinDate = new Date(profile.created_at).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
  })

  return (
    <main className="container max-w-4xl py-10">
      <article className="flex flex-col items-center text-center">
        <Avatar className="h-32 w-32">
          <AvatarImage src={profile.avatar_url ?? undefined} alt={displayName} />
          <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
        </Avatar>

        <h1 className="mt-4 text-2xl font-bold">{displayName}</h1>
        <p className="text-muted-foreground">@{profile.username}</p>

        {profile.bio && <p className="mt-4 max-w-md">{profile.bio}</p>}

        <p className="text-muted-foreground mt-4 text-sm">{joinDate} 가입</p>

        {isOwnProfile && (
          <Button asChild variant="outline" className="mt-4">
            <Link href="/settings/profile">프로필 편집</Link>
          </Button>
        )}
      </article>

      <section className="mt-12">
        <h2 className="text-xl font-semibold">작성한 글</h2>
        <p className="text-muted-foreground mt-4">아직 작성한 글이 없습니다.</p>
      </section>
    </main>
  )
}
