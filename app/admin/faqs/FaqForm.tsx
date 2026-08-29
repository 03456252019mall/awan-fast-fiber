"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function FaqForm() {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    await supabase.from("faqs").insert({ question, answer });
    setLoading(false);
    setQuestion("");
    setAnswer("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
      <input required placeholder="Question" value={question} onChange={(e) => setQuestion(e.target.value)} className="rounded-lg border border-white/15 bg-navy px-3 py-2 text-sm text-white placeholder:text-white/30" />
      <textarea required placeholder="Answer" rows={2} value={answer} onChange={(e) => setAnswer(e.target.value)} className="rounded-lg border border-white/15 bg-navy px-3 py-2 text-sm text-white placeholder:text-white/30" />
      <button type="submit" disabled={loading} className="self-start rounded-lg bg-amber px-4 py-2 text-sm font-semibold text-navy disabled:opacity-50">
        {loading ? "Adding..." : "Add FAQ"}
      </button>
    </form>
  );
}
