"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    async function sendLink() {
        setMessage("送信中...");
        const supabase = createClient();
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                // メールのリンクを押したときに戻ってくる場所
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) {
            setMessage(`送信できませんでした：${error.message}`);
        } else {
            setMessage("メールを送りました。届いたメールのリンクを、このブラウザで開いてください。");
        }
    }

    return (
        <main className="p-8">
            <h1 className="text-2xl font-bold">ログイン</h1>
            <p className="mt-2">メールアドレスを入力すると、ログイン用のリンクがメールで届きます。</p>
            <input
                type="email"
                className="mt-4 block w-full max-w-sm rounded border border-gray-400 p-2"
                placeholder="メールアドレス"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button
                className="mt-3 rounded bg-blue-500 px-6 py-2 text-white"
                onClick={sendLink}
            >
                ログイン用のリンクを送る
            </button>
            <p className="mt-4">{message}</p>
        </main>
    );
}