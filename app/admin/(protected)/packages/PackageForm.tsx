"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function PackageForm() {
  const router = useRouter();
  const [speed, setSpeed] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    await supabase.from("packages").insert({
      speed_mbps: Number(speed),
      price: Number(price),
      description
    });
    setLoading(false);
    setSpeed("");
    setPrice("");
    setDescription("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 grid gap-3 sm:grid-cols-4">
      <input required type="number" placeholder="Speed (Mbps)" value={speed} onChange={(e) => setSpeed(e.target.value)} className="rounded-lg border border-white/15 bg-navy px-3 py-2 text-sm text-white placeholder:text-white/30" />
      <input required type="number" placeholder="Price (Rs.)" value={price} onChange={(e) => setPrice(e.target.value)} className="rounded-lg border border-white/15 bg-navy px-3 py-2 text-sm text-white placeholder:text-white/30" />
      <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="rounded-lg border border-white/15 bg-navy px-3 py-2 text-sm text-white placeholder:text-white/30 sm:col-span-1" />
      <button type="submit" disabled={loading} className="rounded-lg bg-amber px-4 py-2 text-sm font-semibold text-navy disabled:opacity-50">
        {loading ? "Adding..." : "Add Package"}
      </button>
    </form>
  );
}
