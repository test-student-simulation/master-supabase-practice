import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { signOut } from "@/app/actions";

// このページは開くたびにログイン状態を確かめるので、あらかじめ作っておかない
export const instant = false;

export default async function PrivatePage() {
    // ここから先は、ページを開いた人ごとに、そのときに処理する
    await connection();

    const supabase = await createClient();
    // サーバー側でログイン状態を確かめる
    const { data } = await supabase.auth.getClaims();

    // ログインしていなければ、ページを渡さずにログイン画面へ移す
    if (!data) {
        redirect("/login?next=/private");
    }

    return (
        <main className="p-8">
            <h1 className="text-2xl font-bold">会員ページ</h1>
            <p className="mt-2">ログインした人だけが見られるページです。</p>
            <p className="mt-2">ログイン中：{data.claims.email}</p>
            <form action={signOut}>
                <button className="cursor-pointer text-blue-500 underline">ログアウト</button>
            </form>
            <Link href="/" className="mt-4 inline-block text-blue-500 underline">
                トップに戻る
            </Link>
        </main>
    );
}