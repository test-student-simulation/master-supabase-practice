import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

// このページは開くたびにログイン状態を確かめるので、あらかじめ作っておかない
export const instant = false;

export default async function PrivatePage() {
    const supabase = await createClient();
    // サーバー側でログイン状態を確かめる
    const { data } = await supabase.auth.getClaims();

    // ログインしていなければ、ページを渡さずにログイン画面へ移す
    if (!data) {
        redirect("/login");
    }

    // ログアウトのボタンを押したときに、サーバーで動く処理
    async function signOut() {
        "use server";
        const supabase = await createClient();
        await supabase.auth.signOut();
        redirect("/login");
    }

    return (
        <main className="p-8">
            <h1 className="text-2xl font-bold">会員ページ</h1>
            <p className="mt-2">ログインした人だけが見られるページです。</p>
            <p className="mt-2">ログイン中：{data.claims.email}</p>
            <form action={signOut}>
                <button className="mt-4 rounded bg-gray-500 px-6 py-2 text-white">
                    ログアウト
                </button>
            </form>
        </main>
    );
}