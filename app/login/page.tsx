"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const router = useRouter();

    // 新規登録：確認のメールが届く（最初の1回だけ）
    async function signUp() {
        setMessage("登録中...");
        const supabase = createClient();
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                // 確認メールのリンクを押したときに戻ってくる場所
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) {
            setMessage(`登録できませんでした：${error.message}`);
        } else if (data.user?.identities?.length === 0) {
            setMessage("このメールアドレスはすでに登録されています。「ログイン」を押してください。");
        } else {
            setMessage("確認のメールを送りました。届いたメールのリンクを、このブラウザで開いてください。");
        }
    }

    // ログイン：メールは送られない
    async function signIn() {
        setMessage("ログイン中...");
        const supabase = createClient();
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setMessage(`ログインできませんでした：${error.message}`);
        } else {
            // ログインできたら会員ページへ移る
            router.push("/private");
            router.refresh();
        }
    }

    return (
        <main className="p-8">
            <h1 className="text-2xl font-bold">ログイン</h1>
            <p className="mt-2">初めての人は「新規登録」、登録済みの人は「ログイン」を押してください。</p>
            <input
                type="email"
                className="mt-4 block w-full max-w-sm rounded border border-gray-400 p-2"
                placeholder="メールアドレス"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                className="mt-2 block w-full max-w-sm rounded border border-gray-400 p-2"
                placeholder="パスワード（6文字以上）"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <div className="mt-3 flex gap-2">
                <button
                    className="rounded bg-blue-500 px-6 py-2 text-white"
                    onClick={signIn}
                >
                    ログイン
                </button>
                <button
                    className="rounded border border-blue-500 px-6 py-2 text-blue-500"
                    onClick={signUp}
                >
                    新規登録
                </button>
            </div>
            <p className="mt-4">{message}</p>
        </main>
    );
}