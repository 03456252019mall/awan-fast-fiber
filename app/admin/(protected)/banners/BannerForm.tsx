"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function BannerForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    image_url: "",
    button_text: "",
    button_url: "",
    start_date: "",
    end_date: ""
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    await supabase.from("banners").insert({
      title: form.title,
      description: form.description || null,
      image_url: form.image_url || null,
      button_text: form.button_text || null,
      button_url: form.button_url || null,
      start_date: form.start_date || null,
      end_date: form.end_date || null
    });
    setLoading(false);
    setForm({ title: "", description: "", image_url: "", button_text: "", button_url: "", start_date: "", end_date: "" });
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 grid gap-3 sm:grid-cols-2">
      <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-lg border border-white/15 bg-navy px-3 py-2 text-sm text-white placeholder:text-white/30 sm:col-span-2" />
      <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded-lg border border-white/15 bg-navy px-3 py-2 text-sm text-white placeholder:text-white/30 sm:col-span-2" />
      <input placeholder="Image URL (optional)" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="rounded-lg border border-white/15 bg-navy px-3 py-2 text-sm text-white placeholder:text-white/30 sm:col-span-2" />
      <input placeholder="Button text (e.g. Get Offer)" value={form.button_text} onChange={(e) => setForm({ ...form, button_text: e.target.value })} className="rounded-lg border border-white/15 bg-navy px-3 py-2 text-sm text-white placeholder:text-white/30" />
      <input placeholder="Button link (e.g. /new-connection)" value={form.button_url} onChange={(e) => setForm({ ...form, button_url: e.target.value })} className="rounded-lg border border-white/15 bg-navy px-3 py-2 text-sm text-white placeholder:text-white/30" />
      <div>
        <label className="text-xs text-white/40">Start date (optional)</label>
        <input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} className="mt-1 w-full rounded-lg border border-white/15 bg-navy px-3 py-2 text-sm text-white" />
      </div>
      <div>
        <label className="text-xs text-white/40">End date (optional)</label>
        <input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} className="mt-1 w-full rounded-lg border border-white/15 bg-navy px-3 py-2 text-sm text-white" />
      </div>
      <button type="submit" disabled={loading} className="rounded-lg bg-amber px-4 py-2 text-sm font-semibold text-navy disabled:opacity-50 sm:col-span-2">
        {loading ? "Adding..." : "Add Banner"}
      </button>
    </form>
  );
}
