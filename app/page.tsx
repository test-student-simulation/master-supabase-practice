import Link from "next/link";
import { connection } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { signOut } from "@/app/actions";

// このページは開くたびにログイン状態を確かめるので、あらかじめ作っておかない
export const instant = false;

export default async function Home() {
  // ここから先は、ページを開いた人ごとに、そのときに処理する
  await connection();

  const supabase = await createClient();
  // ログインしているかどうかを確かめる（ログインしていなければ data は null）
  const { data } = await supabase.auth.getClaims();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">supabase-practice</h1>
      <p className="mt-2">Supabaseでログインを試すアプリです。</p>
      <ul className="mt-4 list-disc pl-6">
        <li>
          {data ? (
            <form action={signOut}>
              <button className="cursor-pointer text-blue-500 underline">ログアウト</button>
            </form>
          ) : (
            <Link href="/login" className="text-blue-500 underline">
              ログイン
            </Link>
          )}
        </li>
        <li>
          <Link href="/private" className="text-blue-500 underline">
            会員ページ（ログインした人だけ）
          </Link>
        </li>
      </ul>
    </main>
  );
}