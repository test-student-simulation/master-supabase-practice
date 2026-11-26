import Link from "next/link";

export default function AuthErrorPage() {
    return (
        <main className="p-8">
            <h1 className="text-2xl font-bold">ログインできませんでした</h1>
            <p className="mt-2">
                メールのリンクの期限が切れているか、ログインを申し込んだのとは別のブラウザでリンクを開いた可能性があります。
            </p>
            <Link href="/login" className="mt-4 inline-block text-blue-500 underline">
                ログイン画面に戻る
            </Link>
        </main>
    );
}