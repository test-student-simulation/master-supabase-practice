import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    // メールのリンクに付いている、ログイン用の一時的な番号
    const code = searchParams.get('code')

    if (code) {
        const supabase = await createClient()
        // 番号をSupabaseに送って、ログイン状態（Cookie）に交換する
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            return NextResponse.redirect(`${origin}/private`)
        }
    }

    return NextResponse.redirect(`${origin}/auth/error`)
}