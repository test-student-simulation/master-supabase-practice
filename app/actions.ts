"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

// ログインの後に移る場所。自分のサイトの中（/ で始まる場所）だけを許す
function safeNext(next: FormDataEntryValue | null) {
    const path = String(next ?? "/");
    return path.startsWith("/") && !path.startsWith("//") ? path : "/";
}

// ログイン画面に戻して、メッセージを表示する
function backToLogin(next: string, message: string): never {
    redirect(`/login?next=${encodeURIComponent(next)}&message=${encodeURIComponent(message)}`);
}

// ログイン：メールは送られない
export async function signIn(formData: FormData) {
    const next = safeNext(formData.get("next"));
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
        email: String(formData.get("email")),
        password: String(formData.get("password")),
    });

    if (error) {
        backToLogin(next, `ログインできませんでした：${error.message}`);
    }

    // ブラウザが覚えている古いページを使わず、ログイン後の状態で作り直す
    revalidatePath("/", "layout");
    redirect(next);
}

// 新規登録：確認のメールが届く（最初の1回だけ）
export async function signUp(formData: FormData) {
    const next = safeNext(formData.get("next"));
    const origin = (await headers()).get("origin");
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
        email: String(formData.get("email")),
        password: String(formData.get("password")),
        options: {
            // 確認メールのリンクを押したときに戻ってくる場所
            emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
    });

    if (error) {
        backToLogin(next, `登録できませんでした：${error.message}`);
    }
    if (data.user?.identities?.length === 0) {
        backToLogin(next, "このメールアドレスはすでに登録されています。「ログイン」を押してください。");
    }
    backToLogin(next, "確認のメールを送りました。届いたメールのリンクを、このブラウザで開いてください。");
}

// ログアウト
export async function signOut() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    // ブラウザが覚えている古いページを使わず、ログアウト後の状態で作り直す
    revalidatePath("/", "layout");
    redirect("/");
}