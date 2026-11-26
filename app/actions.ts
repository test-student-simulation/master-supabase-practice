"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

// ログアウトのボタンを押したときに、サーバーで動く処理
export async function signOut() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/");
}