"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Banner = {
  id: string;
  title: string;
  description: string | null;
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
};

export default function BannerRow({ banner }: { banner: Banner }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggleActive() {
    setLoading(true);
    const supabase = createClient();
    await supabase.from("banners").update({ is_active: !banner.is_active }).eq("id", banner.id);
    setLoading(false);
    router.refresh();
  }

  async function remove() {
    if (!confirm("Delete this banner?")) return;
    const supabase = createClient();
    await supabase.from("banners").delete().eq("id", banner.id);
    router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div>
        <p className="font-medium text-white">{banner.title}</p>
        {banner.description && <p className="text-xs text-white/40">{banner.description}</p>}
        {(banner.start_date || banner.end_date) && (
          <p className="mt-1 text-xs text-white/30">{banner.start_date ?? "…"} → {banner.end_date ?? "…"}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span className={banner.is_active ? "text-xs text-emerald-400" : "text-xs text-white/40"}>
          {banner.is_active ? "Active" : "Inactive"}
        </span>
        <button onClick={toggleActive} disabled={loading} className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/70 hover:text-white">
          {banner.is_active ? "Deactivate" : "Activate"}
        </button>
        <button onClick={remove} className="rounded-full border border-red-500/30 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10">
          Delete
        </button>
      </div>
    </div>
  );
}
