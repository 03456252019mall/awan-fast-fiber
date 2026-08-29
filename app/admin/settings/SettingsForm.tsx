"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Settings = {
  hero_heading: string | null;
  hero_subheading: string | null;
  about_text: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  facebook_url: string | null;
  instagram: string | null;
  tiktok: string | null;
  youtube: string | null;
};

export default function SettingsForm({ settings }: { settings: Settings | null }) {
  const router = useRouter();
  const [form, setForm] = useState<Settings>({
    hero_heading: settings?.hero_heading ?? "",
    hero_subheading: settings?.hero_subheading ?? "",
    about_text: settings?.about_text ?? "",
    phone: settings?.phone ?? "",
    whatsapp: settings?.whatsapp ?? "",
    email: settings?.email ?? "",
    facebook_url: settings?.facebook_url ?? "",
    instagram: settings?.instagram ?? "",
    tiktok: settings?.tiktok ?? "",
    youtube: settings?.youtube ?? ""
  });
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    const supabase = createClient();
    await supabase.from("website_settings").upsert({ id: 1, ...form, updated_at: new Date().toISOString() });
    setStatus("saved");
    router.refresh();
    setTimeout(() => setStatus("idle"), 2000);
  }

  const field = (key: keyof Settings) => ({
    value: form[key] ?? "",
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [key]: e.target.value })
  });

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex max-w-2xl flex-col gap-5">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <p className="font-semibold text-white">Homepage Hero</p>
        <label className="mt-3 block text-xs text-white/40">Heading</label>
        <input {...field("hero_heading")} className="mt-1 w-full rounded-lg border border-white/15 bg-navy px-3 py-2 text-sm text-white" />
        <label className="mt-3 block text-xs text-white/40">Subheading</label>
        <textarea {...field("hero_subheading")} rows={2} className="mt-1 w-full rounded-lg border border-white/15 bg-navy px-3 py-2 text-sm text-white" />
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <p className="font-semibold text-white">About / Company History</p>
        <textarea {...field("about_text")} rows={8} className="mt-3 w-full rounded-lg border border-white/15 bg-navy px-3 py-2 text-sm text-white" />
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <p className="font-semibold text-white">Contact & Social</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div><label className="text-xs text-white/40">Phone</label><input {...field("phone")} className="mt-1 w-full rounded-lg border border-white/15 bg-navy px-3 py-2 text-sm text-white" /></div>
          <div><label className="text-xs text-white/40">WhatsApp</label><input {...field("whatsapp")} className="mt-1 w-full rounded-lg border border-white/15 bg-navy px-3 py-2 text-sm text-white" /></div>
          <div><label className="text-xs text-white/40">Email</label><input {...field("email")} className="mt-1 w-full rounded-lg border border-white/15 bg-navy px-3 py-2 text-sm text-white" /></div>
          <div><label className="text-xs text-white/40">Facebook URL</label><input {...field("facebook_url")} className="mt-1 w-full rounded-lg border border-white/15 bg-navy px-3 py-2 text-sm text-white" /></div>
          <div><label className="text-xs text-white/40">Instagram handle</label><input {...field("instagram")} className="mt-1 w-full rounded-lg border border-white/15 bg-navy px-3 py-2 text-sm text-white" /></div>
          <div><label className="text-xs text-white/40">TikTok handle</label><input {...field("tiktok")} className="mt-1 w-full rounded-lg border border-white/15 bg-navy px-3 py-2 text-sm text-white" /></div>
          <div><label className="text-xs text-white/40">YouTube handle</label><input {...field("youtube")} className="mt-1 w-full rounded-lg border border-white/15 bg-navy px-3 py-2 text-sm text-white" /></div>
        </div>
      </div>

      <button type="submit" disabled={status === "saving"} className="self-start rounded-full bg-amber px-6 py-2.5 text-sm font-semibold text-navy disabled:opacity-60">
        {status === "saving" ? "Saving..." : status === "saved" ? "Saved ✓" : "Save Changes"}
      </button>
    </form>
  );
}
