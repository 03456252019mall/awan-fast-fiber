"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Faq = { id: string; question: string; answer: string; is_active: boolean };

export default function FaqRow({ faq }: { faq: Faq }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [question, setQuestion] = useState(faq.question);
  const [answer, setAnswer] = useState(faq.answer);
  const [loading, setLoading] = useState(false);

  async function save() {
    setLoading(true);
    const supabase = createClient();
    await supabase.from("faqs").update({ question, answer }).eq("id", faq.id);
    setLoading(false);
    setEditing(false);
    router.refresh();
  }

  async function toggleActive() {
    const supabase = createClient();
    await supabase.from("faqs").update({ is_active: !faq.is_active }).eq("id", faq.id);
    router.refresh();
  }

  async function remove() {
    if (!confirm("Delete this FAQ?")) return;
    const supabase = createClient();
    await supabase.from("faqs").delete().eq("id", faq.id);
    router.refresh();
  }

  if (editing) {
    return (
      <div className="flex flex-col gap-2 rounded-xl border border-cyan/30 bg-white/[0.03] p-4">
        <input value={question} onChange={(e) => setQuestion(e.target.value)} className="rounded-lg border border-white/15 bg-navy px-3 py-1.5 text-sm text-white" />
        <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} rows={2} className="rounded-lg border border-white/15 bg-navy px-3 py-1.5 text-sm text-white" />
        <div className="flex gap-2">
          <button onClick={save} disabled={loading} className="rounded-full bg-cyan px-3 py-1.5 text-xs font-semibold text-navy">Save</button>
          <button onClick={() => setEditing(false)} className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/70">Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div className="max-w-lg">
        <p className="font-medium text-white">{faq.question}</p>
        <p className="mt-1 text-xs text-white/50">{faq.answer}</p>
      </div>
      <div className="flex items-center gap-2">
        <span className={faq.is_active ? "text-xs text-emerald-400" : "text-xs text-white/40"}>
          {faq.is_active ? "Active" : "Inactive"}
        </span>
        <button onClick={() => setEditing(true)} className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/70 hover:text-white">Edit</button>
        <button onClick={toggleActive} className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/70 hover:text-white">
          {faq.is_active ? "Deactivate" : "Activate"}
        </button>
        <button onClick={remove} className="rounded-full border border-red-500/30 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10">Delete</button>
      </div>
    </div>
  );
}
