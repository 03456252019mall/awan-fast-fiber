"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Area = { id: string; name: string; description: string | null; is_active: boolean };

export default function AreaRow({ area }: { area: Area }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(area.name);
  const [description, setDescription] = useState(area.description ?? "");
  const [loading, setLoading] = useState(false);

  async function save() {
    setLoading(true);
    const supabase = createClient();
    await supabase.from("service_areas").update({ name, description: description || null }).eq("id", area.id);
    setLoading(false);
    setEditing(false);
    router.refresh();
  }

  async function toggleActive() {
    const supabase = createClient();
    await supabase.from("service_areas").update({ is_active: !area.is_active }).eq("id", area.id);
    router.refresh();
  }

  async function remove() {
    if (!confirm(`Delete "${area.name}"? This cannot be undone.`)) return;
    const supabase = createClient();
    await supabase.from("service_areas").delete().eq("id", area.id);
    router.refresh();
  }

  if (editing) {
    return (
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-cyan/30 bg-white/[0.03] p-4">
        <input value={name} onChange={(e) => setName(e.target.value)} className="rounded-lg border border-white/15 bg-navy px-3 py-1.5 text-sm text-white" />
        <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="flex-1 rounded-lg border border-white/15 bg-navy px-3 py-1.5 text-sm text-white" />
        <button onClick={save} disabled={loading} className="rounded-full bg-cyan px-3 py-1.5 text-xs font-semibold text-navy">Save</button>
        <button onClick={() => setEditing(false)} className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/70">Cancel</button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div>
        <p className="font-medium text-white">{area.name}</p>
        {area.description && <p className="text-xs text-white/40">{area.description}</p>}
      </div>
      <div className="flex items-center gap-2">
        <span className={area.is_active ? "text-xs text-emerald-400" : "text-xs text-white/40"}>
          {area.is_active ? "Active" : "Inactive"}
        </span>
        <button onClick={() => setEditing(true)} className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/70 hover:text-white">Edit</button>
        <button onClick={toggleActive} className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/70 hover:text-white">
          {area.is_active ? "Deactivate" : "Activate"}
        </button>
        <button onClick={remove} className="rounded-full border border-red-500/30 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10">Delete</button>
      </div>
    </div>
  );
}
