"use client";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();
  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }
  return (
    <button onClick={handleLogout} className="w-full rounded-lg border border-white/15 px-4 py-2.5 text-sm text-white/70 hover:text-white">
      Log Out
    </button>
  );
}
