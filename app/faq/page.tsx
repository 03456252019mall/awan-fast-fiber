import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "FAQ | Awan Fast Fiber" };

export default async function FaqPage() {
  const supabase = createClient();
  const { data: faqs } = await supabase.from("faqs").select("*").eq("is_active", true).order("sort_order");

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="font-display text-3xl font-bold text-white md:text-4xl">Frequently Asked Questions</h1>
      <div className="mt-10 flex flex-col gap-4">
        {(faqs ?? []).map((f) => (
          <details key={f.id} className="group rounded-xl border border-white/10 bg-white/[0.03] p-5 open:bg-white/[0.05]">
            <summary className="cursor-pointer list-none font-medium text-white">
              {f.question}
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-white/60">{f.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
