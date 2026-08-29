import { createClient } from "@/lib/supabase/server";
import FaqForm from "./FaqForm";
import FaqRow from "./FaqRow";

export default async function AdminFaqsPage() {
  const supabase = createClient();
  const { data: faqs } = await supabase.from("faqs").select("*").order("sort_order");

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white">FAQs</h1>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <p className="font-semibold text-white">Add New FAQ</p>
        <FaqForm />
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {(faqs ?? []).map((f) => (
          <FaqRow key={f.id} faq={f as any} />
        ))}
        {(!faqs || faqs.length === 0) && <p className="text-sm text-white/50">No FAQs yet.</p>}
      </div>
    </div>
  );
}
