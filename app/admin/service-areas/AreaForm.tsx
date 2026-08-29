"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AreaForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.from("service_areas").insert({ name, description: description || null });
    setLoading(false);
    if (error) {
      setError(error.message.includes("duplicate") ? "This area already exists." : error.message);
      return;
    }
    setName("");
    setDescription("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 grid gap-3 sm:grid-cols-3">
      <input required placeholder="Area name (e.g. Chak 481)" value={name} onChange={(e) => setName(e.target.value)} className="rounded-lg border border-white/15 bg-navy px-3 py-2 text-sm text-white placeholder:text-white/30" />
      <input placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} className="rounded-lg border border-white/15 bg-navy px-3 py-2 text-sm text-white placeholder:text-white/30" />
      <button type="submit" disabled={loading} className="rounded-lg bg-amber px-4 py-2 text-sm font-semibold text-navy disabled:opacity-50">
        {loading ? "Adding..." : "Add Area"}
      </button>
      {error && <p className="text-sm text-red-400 sm:col-span-3">{error}</p>}
    </form>
  );
}
