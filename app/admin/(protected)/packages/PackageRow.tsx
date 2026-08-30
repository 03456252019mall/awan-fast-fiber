"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { formatPKR } from "@/lib/utils";

type Pkg = { id: string; speed_mbps: number; price: number; description: string | null; is_active: boolean; is_popular: boolean };

export default function PackageRow({ pkg }: { pkg: Pkg }) {
  const router = useRouter();
  const [price, setPrice] = useState(pkg.price);
  const [loading, setLoading] = useState(false);

  async function save() {
    setLoading(true);
    const supabase = createClient();
    await supabase.from("packages").update({ price }).eq("id", pkg.id);
    setLoading(false);
    router.refresh();
  }

  async function toggleActive() {
    const supabase = createClient();
    await supabase.from("packages").update({ is_active: !pkg.is_active }).eq("id", pkg.id);
    router.refresh();
  }

  async function togglePopular() {
    const supabase = createClient();
    await supabase.from("packages").update({ is_popular: !pkg.is_popular }).eq("id", pkg.id);
    router.refresh();
  }

  async function remove() {
    if (!confirm(`Delete the ${pkg.speed_mbps} Mbps package? This cannot be undone.`)) return;
    const supabase = createClient();
    await supabase.from("packages").delete().eq("id", pkg.id);
    router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div>
        <p className="font-mono text-sm text-cyan">{pkg.speed_mbps} Mbps</p>
        <p className="text-xs text-white/40">{pkg.description}</p>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-28 rounded-lg border border-white/15 bg-navy px-3 py-1.5 text-sm text-white"
        />
        <button onClick={save} disabled={loading} className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/70 hover:text-white">
          Save
        </button>
        <button onClick={togglePopular} className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/70 hover:text-white">
          {pkg.is_popular ? "Unmark Popular" : "Mark Popular"}
        </button>
        <button onClick={toggleActive} className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/70 hover:text-white">
          {pkg.is_active ? "Deactivate" : "Activate"}
        </button>
        <button onClick={remove} className="rounded-full border border-red-500/30 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10">
          Delete
        </button>
      </div>
    </div>
  );
}
