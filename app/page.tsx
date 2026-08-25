import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { BUSINESS, whatsappLink } from "@/lib/constants";
import PackageCard from "@/components/PackageCard";

export default async function HomePage() {
  const supabase = createClient();

  const [{ data: packages }, { data: areas }, { data: faqs }] = await Promise.all([
    supabase.from("packages").select("*").eq("is_active", true).order("sort_order").limit(4),
    supabase.from("service_areas").select("name").eq("is_active", true),
    supabase.from("faqs").select("*").eq("is_active", true).order("sort_order").limit(4)
  ]);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/10 fiber-lines">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 md:grid-cols-2 md:py-28">
          <div>
            <span className="inline-block rounded-full border border-cyan/30 bg-cyan/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-cyan">
              Serving Chak 481 JB &amp; nearby villages
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-white md:text-5xl">
              Fast, reliable fiber internet — brought to your village.
            </h1>
            <p className="mt-5 max-w-lg text-white/65">
              {BUSINESS.name} connects homes across our service areas with dependable, affordable
              internet backed by real local support.
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
        <h2 className="font-display text-2xl font-bold text-white md:text-3xl">Why choose Awan Fast Fiber</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            { title: "Real local support", desc: "Family-run and based in Chak 481 JB — we know our service areas personally." },
            { title: "Fiber-optic backbone", desc: "Our main fiber backbone, deployed November 2025, means stronger and more reliable connections." },
            { title: "Fair, transparent pricing", desc: "Straightforward monthly packages with no hidden charges." }
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="font-display text-lg font-semibold text-white">{f.title}</p>
              <p className="mt-2 text-sm text-white/60">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PACKAGES */}
      <section className="border-y border-white/10 bg-white/[0.02] py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-2xl font-bold text-white md:text-3xl">Internet packages</h2>
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
        <h2 className="font-display text-2xl font-bold text-white md:text-3xl">Where we serve</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          {(areas ?? []).map((a) => (
            <span key={a.name} className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/70">
              {a.name}
            </span>
          ))}
        </div>
        <Link href="/coverage" className="mt-6 inline-block text-sm font-medium text-cyan hover:underline">
          Check if your address is covered →
        </Link>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-y border-white/10 bg-white/[0.02] py-20">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="font-display text-2xl font-bold text-white md:text-3xl">How it works</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              ["Choose a package", "Pick the speed that fits your home."],
              ["Submit your request", "Fill the new connection form — we'll reach out to confirm."],
              ["Get connected", "Our technician installs your fiber connection and ONT."]
            ].map(([title, desc], i) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-navy p-6">
                <p className="font-mono text-sm text-cyan">Step {i + 1}</p>
                <p className="mt-2 font-display text-lg font-semibold text-white">{title}</p>
                <p className="mt-2 text-sm text-white/60">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ TEASER */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="font-display text-2xl font-bold text-white md:text-3xl">Frequently asked questions</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {(faqs ?? []).map((f) => (
            <div key={f.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
              <p className="font-semibold text-white">{f.question}</p>
              <p className="mt-2 text-sm text-white/60">{f.answer}</p>
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
