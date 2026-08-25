"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const CATEGORIES = ["Red Light", "Internet Slow", "No Internet", "Other"];

export default function NewComplaintPage() {
  const router = useRouter();
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [details, setDetails] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [code, setCode] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let attachment_url: string | null = null;
    if (file) {
      const path = `${user.id}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage.from("complaint-attachments").upload(path, file);
      if (!uploadError) attachment_url = path;
    }

    const { data, error } = await supabase
      .from("complaints")
      .insert({ profile_id: user.id, category, details, attachment_url })
      .select("complaint_code")
      .single();

    if (error || !data) {
      setStatus("error");
      return;
    }
    setCode(data.complaint_code);
  }

  if (code) {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6">
        <p className="font-semibold text-emerald-300">Complaint submitted successfully.</p>
        <p className="mt-2 text-white/70">
          Your Complaint ID is <span className="font-mono text-white">{code}</span>.
        </p>
        <button onClick={() => router.push("/dashboard/complaints")} className="mt-4 rounded-full bg-amber px-4 py-2 text-sm font-semibold text-navy">
          View My Complaints
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white">Submit a Complaint</h1>
      <form onSubmit={handleSubmit} className="mt-6 flex max-w-lg flex-col gap-4">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-white/15 bg-navy px-4 py-2.5 text-sm text-white"
        >
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <textarea
          required
          rows={5}
          placeholder="Describe the issue…"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          className="rounded-lg border border-white/15 bg-navy px-4 py-2.5 text-sm text-white placeholder:text-white/30"
        />
        <div>
          <label className="text-xs text-white/50">Attach a photo or screenshot (optional)</label>
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="mt-1 block text-sm text-white/70" />
        </div>
        {status === "error" && <p className="text-sm text-red-400">Something went wrong. Please try again.</p>}
        <button type="submit" disabled={status === "sending"} className="self-start rounded-full bg-amber px-5 py-2.5 text-sm font-semibold text-navy disabled:opacity-60">
          {status === "sending" ? "Submitting..." : "Submit Complaint"}
        </button>
      </form>
    </div>
  );
}
