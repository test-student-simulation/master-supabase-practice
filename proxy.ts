import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet, headers) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                    // ログイン情報を含む返事を、ほかの人に使い回されないようにする
                    Object.entries(headers).forEach(([key, value]) =>
                        supabaseResponse.headers.set(key, value)
                    )
                },
            },
        }
    )

    // ログイン状態を確かめる（期限が近いログイン情報は、ここで更新される）
    // この行を消すと、しばらくして勝手にログアウトされることがある
    const { data } = await supabase.auth.getClaims()

    // ログインしていない人が会員ページ（/private と、その下のページ）を開いたら、
    // ページを作る前にログイン画面へ移す。ログインの後は、開こうとしたページに戻る
    const path = request.nextUrl.pathname
    const isPrivate = path === '/private' || path.startsWith('/private/')
    if (!data && isPrivate) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        url.search = `?next=${encodeURIComponent(path)}`
        return NextResponse.redirect(url)
    }
    
    return supabaseResponse
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}