"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function CustomerToggle({ id, isActive }: { id: string; isActive: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    const supabase = createClient();
    await supabase.from("profiles").update({ is_active: !isActive }).eq("id", id);
    setLoading(false);
    router.refresh();
  }

  return (
    <button onClick={toggle} disabled={loading} className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/70 hover:text-white disabled:opacity-50">
      {isActive ? "Deactivate" : "Activate"}
    </button>
  );
}
