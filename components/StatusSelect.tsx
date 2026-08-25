"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function StatusSelect({
  table,
  id,
  currentStatus,
  options
}: {
  table: string;
  id: string;
  currentStatus: string;
  options: string[];
}) {
  const router = useRouter();
  const [value, setValue] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value;
    setValue(newStatus);
    setLoading(true);
    const supabase = createClient();
    await supabase.from(table).update({ status: newStatus, updated_at: new Date().toISOString() }).eq("id", id);
    setLoading(false);
    router.refresh();
  }

  return (
    <select
      value={value}
      onChange={handleChange}
      disabled={loading}
      className="rounded-lg border border-white/15 bg-navy px-3 py-1.5 text-xs text-white disabled:opacity-50"
    >
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}
