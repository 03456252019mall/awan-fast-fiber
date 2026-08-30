import { createClient } from "@/lib/supabase/server";
import { BUSINESS } from "@/lib/constants";

export const metadata = { title: "About Us | Awan Fast Fiber" };

const TIMELINE = [
  { year: "2021", title: "Business Established" },
  { year: "2021–2025", title: "FTTH & Wireless Network Expansion" },
  { year: "November 2025", title: "Main Fiber-Optic Backbone Deployment" },
  { year: "Present", title: "Reliable Internet & Network Expansion" },
  { year: "Future", title: "Expansion to More Communities" }
];

export default async function AboutPage() {
  const supabase = createClient();
  const { data: settings } = await supabase.from("website_settings").select("about_text").eq("id", 1).single();

  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <h1 className="font-display text-3xl font-bold text-white md:text-4xl">About Awan Fast Fiber</h1>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6 leading-relaxed text-white/70">
        {(settings?.about_text ?? "").split("\n").filter(Boolean).map((p: string, i: number) => (
          <p key={i} className="mb-4 last:mb-0">{p}</p>
        ))}
      </div>

      <div className="mt-6 grid gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-white/40">Founders</p>
          <p className="mt-1 font-medium text-white">{BUSINESS.founders.join(" & ")}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-white/40">Father</p>
          <p className="mt-1 font-medium text-white">{BUSINESS.father}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-white/40">Family</p>
          <p className="mt-1 font-medium text-white">{BUSINESS.family}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-white/40">Established</p>
          <p className="mt-1 font-medium text-white">{BUSINESS.established}</p>
        </div>
      </div>

      <h2 className="mt-12 font-display text-2xl font-bold text-white">Our Journey</h2>
      <div className="mt-6 border-l border-white/15 pl-6">
        {TIMELINE.map((item, i) => (
          <div key={i} className="relative mb-8 last:mb-0">
            <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full bg-cyan" />
            <p className="font-mono text-xs text-cyan">{item.year}</p>
            <p className="mt-1 font-medium text-white">{item.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
