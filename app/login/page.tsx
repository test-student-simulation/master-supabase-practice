import { signIn, signUp } from "@/app/actions";

// このページはURLの ?next= や ?message= を読むので、あらかじめ作っておかない
export const instant = false;

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ next?: string; message?: string }>;
}) {
    const { next, message } = await searchParams;

    return (
        <main className="p-8">
            <h1 className="text-2xl font-bold">ログイン</h1>
            <p className="mt-2">初めての人は「新規登録」、登録済みの人は「ログイン」を押してください。</p>
            <form>
                {/* ログインの後に移る場所（会員ページから来たときは /private） */}
                <input type="hidden" name="next" value={next ?? "/"} />
                <input
                    type="email"
                    name="email"
                    required
                    className="mt-4 block w-full max-w-sm rounded border border-gray-400 p-2"
                    placeholder="メールアドレス"
                />
                <input
                    type="password"
                    name="password"
                    required
                    minLength={6}
                    className="mt-2 block w-full max-w-sm rounded border border-gray-400 p-2"
                    placeholder="パスワード（6文字以上）"
                />
                <div className="mt-3 flex gap-2">
                    <button
                        formAction={signIn}
                        className="cursor-pointer rounded bg-blue-500 px-6 py-2 text-white"
                    >
                        ログイン
                    </button>
                    <button
                        formAction={signUp}
                        className="cursor-pointer rounded border border-blue-500 px-6 py-2 text-blue-500"
                    >
                        新規登録
                    </button>
                </div>
            </form>
            {message && <p className="mt-4">{message}</p>}
        </main>
    );
}