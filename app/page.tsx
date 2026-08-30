import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { BUSINESS, whatsappLink } from "@/lib/constants";
import PackageCard from "@/components/PackageCard";
import BannerCarousel from "@/components/BannerCarousel";

export default async function HomePage() {
  const supabase = createClient();

  const today = new Date().toISOString().slice(0, 10);
  const [{ data: packages }, { data: areas }, { data: faqs }, { data: banners }, { data: settings }] = await Promise.all([
    supabase.from("packages").select("*").eq("is_active", true).order("sort_order").limit(4),
    supabase.from("service_areas").select("name").eq("is_active", true),
    supabase.from("faqs").select("*").eq("is_active", true).order("sort_order").limit(4),
    supabase
      .from("banners")
      .select("*")
      .eq("is_active", true)
      .or(`start_date.is.null,start_date.lte.${today}`)
      .or(`end_date.is.null,end_date.gte.${today}`)
      .order("sort_order"),
    supabase.from("website_settings").select("hero_heading, hero_subheading").eq("id", 1).single()
  ]);

  const heroHeading = settings?.hero_heading || "Fast, reliable fiber internet — brought to your village.";
  const heroSubheading =
    settings?.hero_subheading ||
    `${BUSINESS.name} connects homes across our service areas with dependable, affordable internet backed by real local support.`;

  return (
    <div>
      <BannerCarousel banners={banners ?? []} />
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/10 fiber-lines">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 md:grid-cols-2 md:py-28">
          <div>
            <span className="inline-block rounded-full border border-cyan/30 bg-cyan/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-cyan">
              Serving Chak 481 JB &amp; nearby villages
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-white md:text-5xl">
              {heroHeading}
            </h1>
            <p className="mt-5 max-w-lg text-white/65">
              {heroSubheading}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/new-connection" className="rounded-full bg-amber px-6 py-3 text-sm font-semibold text-navy hover:brightness-110">
                Get New Connection
              </Link>
              <Link href="/coverage" className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:border-white/40">
                Check Availability
              </Link>
            </div>
            <p className="mt-6 text-xs text-white/40">{BUSINESS.operatesAs}</p>
          </div>

          {/* Signature: network map graphic */}
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <svg viewBox="0 0 400 400" className="h-full w-full">
              <g stroke="#14C7D6" strokeWidth="1.5" strokeOpacity="0.5">
                <line x1="200" y1="200" x2="90" y2="110" />
                <line x1="200" y1="200" x2="310" y2="100" />
                <line x1="200" y1="200" x2="330" y2="230" />
                <line x1="200" y1="200" x2="250" y2="330" />
                <line x1="200" y1="200" x2="110" y2="310" />
                <line x1="200" y1="200" x2="70" y2="220" />
              </g>
              {[
                { x: 200, y: 200, label: "Chak 481 (HQ)", r: 10, core: true },
                { x: 90, y: 110, label: "Chak 480" },
                { x: 310, y: 100, label: "Chak 484" },
                { x: 330, y: 230, label: "Chak 491" },
                { x: 250, y: 330, label: "Waryam Wala" },
                { x: 110, y: 310, label: "Majhi Sultan" }
              ].map((node, i) => (
                <g key={i}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.core ? 10 : 6}
                    fill={node.core ? "#F5A623" : "#14C7D6"}
                    className="motion-safe:animate-pulse"
                  />
                  <text x={node.x} y={node.y + (node.core ? 26 : 20)} textAnchor="middle" fontSize="10" fill="#ffffffaa">
                    {node.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <span className="text-xs font-semibold uppercase tracking-widest text-cyan">Why Awan Fast Fiber</span>
        <h2 className="mt-2 font-display text-2xl font-bold text-white md:text-3xl">Built by the community, for the community</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Real local support",
              desc: "Family-run and based in Chak 481 JB — we know our service areas personally.",
              color: "from-cyan/20 to-cyan/5 border-cyan/30",
              icon: (
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 21c-4.5-3-8-6.5-8-10.5A8 8 0 0 1 12 3a8 8 0 0 1 8 7.5c0 4-3.5 7.5-8 10.5Z" />
                  <circle cx="12" cy="10.5" r="2.5" />
                </svg>
              )
            },
            {
              title: "Fiber-optic backbone",
              desc: "Our main fiber backbone, deployed November 2025, means stronger and more reliable connections.",
              color: "from-skyblue/20 to-skyblue/5 border-skyblue/30",
              icon: (
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M4 12h4l2-4 4 8 2-4h4" />
                </svg>
              )
            },
            {
              title: "Fair, transparent pricing",
              desc: "Straightforward monthly packages with no hidden charges.",
              color: "from-amber/20 to-amber/5 border-amber/30",
              icon: (
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              )
            }
          ].map((f) => (
            <div key={f.title} className={`rounded-2xl border bg-gradient-to-b p-6 ${f.color}`}>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy text-cyan">{f.icon}</div>
              <p className="mt-4 font-display text-lg font-semibold text-white">{f.title}</p>
              <p className="mt-2 text-sm text-white/60">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PACKAGES */}
      <section className="relative border-y border-white/10 bg-navy-deep py-20">
        <div className="pointer-events-none absolute inset-0 opacity-40 fiber-lines" />
        <div className="relative mx-auto max-w-6xl px-5">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-amber">Pricing</span>
              <h2 className="mt-2 font-display text-2xl font-bold text-white md:text-3xl">Internet packages</h2>
            </div>
            <Link href="/packages" className="text-sm font-medium text-cyan hover:underline">View all →</Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {(packages ?? []).map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg as any} />
            ))}
          </div>
        </div>
      </section>

      {/* COVERAGE */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <span className="text-xs font-semibold uppercase tracking-widest text-skyblue">Coverage</span>
        <h2 className="mt-2 font-display text-2xl font-bold text-white md:text-3xl">Where we serve</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {(areas ?? []).map((a) => (
            <div key={a.name} className="flex flex-col items-center gap-2 rounded-xl border border-skyblue/20 bg-skyblue/5 px-3 py-4 text-center">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-skyblue" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 21s7-6.5 7-11.5A7 7 0 0 0 5 9.5C5 14.5 12 21 12 21Z" />
                <circle cx="12" cy="9.5" r="2.3" />
              </svg>
              <span className="text-sm text-white/70">{a.name}</span>
            </div>
          ))}
        </div>
        <Link href="/coverage" className="mt-6 inline-block text-sm font-medium text-cyan hover:underline">
          Check if your address is covered →
        </Link>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-y border-white/10 bg-gradient-to-br from-navy-light via-navy to-navy-deep py-20">
        <div className="mx-auto max-w-6xl px-5">
          <span className="text-xs font-semibold uppercase tracking-widest text-cyan">Getting Started</span>
          <h2 className="mt-2 font-display text-2xl font-bold text-white md:text-3xl">How it works</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              ["Choose a package", "Pick the speed that fits your home."],
              ["Submit your request", "Fill the new connection form — we'll reach out to confirm."],
              ["Get connected", "Our technician installs your fiber connection and ONT."]
            ].map(([title, desc], i) => (
              <div key={title} className="relative rounded-2xl border border-white/10 bg-navy/60 p-6 backdrop-blur">
                <span className="absolute -top-4 left-6 flex h-8 w-8 items-center justify-center rounded-full bg-cyan font-mono text-sm font-bold text-navy">
                  {i + 1}
                </span>
                <p className="mt-3 font-display text-lg font-semibold text-white">{title}</p>
                <p className="mt-2 text-sm text-white/60">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ TEASER */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <span className="text-xs font-semibold uppercase tracking-widest text-amber">Questions</span>
        <h2 className="mt-2 font-display text-2xl font-bold text-white md:text-3xl">Frequently asked questions</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {(faqs ?? []).map((f) => (
            <div key={f.id} className="flex gap-3 rounded-xl border border-amber/15 bg-amber/[0.04] p-5">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber/20 text-xs font-bold text-amber">?</span>
              <div>
                <p className="font-semibold text-white">{f.question}</p>
                <p className="mt-2 text-sm text-white/60">{f.answer}</p>
              </div>
            </div>
          ))}
        </div>
        <Link href="/faq" className="mt-6 inline-block text-sm font-medium text-cyan hover:underline">
          View all FAQs →
        </Link>
      </section>

      {/* CTA */}
      <section className="border-t border-white/10 bg-gradient-to-br from-navy via-navy-light to-navy py-20">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <h2 className="font-display text-3xl font-bold text-white">Ready to get connected?</h2>
          <p className="mt-3 text-white/60">Submit a new connection request and our team will reach out to you shortly.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/new-connection" className="rounded-full bg-amber px-6 py-3 text-sm font-semibold text-navy hover:brightness-110">
              Get New Connection
            </Link>
            <a
              href={whatsappLink("Hello Awan Fast Fiber, I want to check internet availability.")}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:border-white/40"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
