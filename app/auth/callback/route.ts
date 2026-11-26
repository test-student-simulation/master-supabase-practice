import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    // メールのリンクに付いている、ログイン用の一時的な番号
    const code = searchParams.get('code')
    // ログインの後に移る場所（自分のサイトの中だけを許す）
    const next = searchParams.get('next') ?? '/'
    const path = next.startsWith('/') && !next.startsWith('//') ? next : '/'

    if (code) {
        const supabase = await createClient()
        // 番号をSupabaseに送って、ログイン状態（Cookie）に交換する
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            return NextResponse.redirect(`${origin}${path}`)
        }
    }

    return NextResponse.redirect(`${origin}/auth/error`)
}