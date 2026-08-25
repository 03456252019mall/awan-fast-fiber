"use client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Pkg = { id: string; speed_mbps: number; price: number };
type Area = { id: string; name: string };
type Profile = { full_name: string; customer_id: string | null; mobile: string; address: string; service_area_id: string | null } | null;

export default function NewConnectionForm({ packages, areas, profile }: { packages: Pkg[]; areas: Area[]; profile: Profile }) {
  const searchParams = useSearchParams();
  const preselected = searchParams.get("package") ?? "";

  const [form, setForm] = useState({
    full_name: profile?.full_name ?? "",
    customer_id: profile?.customer_id ?? "",
    mobile: profile?.mobile ?? "",
    email: "",
    address: profile?.address ?? "",
    service_area_id: profile?.service_area_id ?? "",
    package_id: preselected
  });
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [code, setCode] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("connection_requests")
      .insert({
        profile_id: userData?.user?.id ?? null,
        full_name: form.full_name,
        customer_id: form.customer_id || null,
        mobile: form.mobile,
        email: form.email || null,
        address: form.address,
        service_area_id: form.service_area_id || null,
        package_id: form.package_id || null
      })
      .select("request_code")
      .single();

    if (error || !data) {
      setStatus("error");
      return;
    }
    setCode(data.request_code);
  }

  if (code) {
    return (
      <div className="mt-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6">
        <p className="font-semibold text-emerald-300">Request submitted successfully.</p>
        <p className="mt-2 text-white/70">
          Your Connection Request ID is <span className="font-mono text-white">{code}</span>. Our team will contact you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <select
        required
        value={form.package_id}
        onChange={(e) => setForm({ ...form, package_id: e.target.value })}
        className="rounded-lg border border-white/15 bg-navy px-4 py-2.5 text-sm text-white"
      >
        <option value="">Select package…</option>
        {packages.map((p) => (
          <option key={p.id} value={p.id}>{p.speed_mbps} Mbps — Rs. {p.price}/mo</option>
        ))}
      </select>
      <input
        required
        placeholder="Full name"
        value={form.full_name}
        onChange={(e) => setForm({ ...form, full_name: e.target.value })}
        className="rounded-lg border border-white/15 bg-navy px-4 py-2.5 text-sm text-white placeholder:text-white/30"
      />
      <input
        placeholder="Customer ID (if you already have one)"
        value={form.customer_id}
        onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
        className="rounded-lg border border-white/15 bg-navy px-4 py-2.5 text-sm text-white placeholder:text-white/30"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          required
          placeholder="Mobile number"
          value={form.mobile}
          onChange={(e) => setForm({ ...form, mobile: e.target.value })}
          className="rounded-lg border border-white/15 bg-navy px-4 py-2.5 text-sm text-white placeholder:text-white/30"
        />
        <input
          type="email"
          placeholder="Email (optional)"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="rounded-lg border border-white/15 bg-navy px-4 py-2.5 text-sm text-white placeholder:text-white/30"
        />
      </div>
      <textarea
        required
        placeholder="Complete address"
        rows={3}
        value={form.address}
        onChange={(e) => setForm({ ...form, address: e.target.value })}
        className="rounded-lg border border-white/15 bg-navy px-4 py-2.5 text-sm text-white placeholder:text-white/30"
      />
      <select
        required
        value={form.service_area_id}
        onChange={(e) => setForm({ ...form, service_area_id: e.target.value })}
        className="rounded-lg border border-white/15 bg-navy px-4 py-2.5 text-sm text-white"
      >
        <option value="">Select service area…</option>
        {areas.map((a) => (
          <option key={a.id} value={a.id}>{a.name}</option>
        ))}
      </select>
      {status === "error" && <p className="text-sm text-red-400">Something went wrong. Please try again.</p>}
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-full bg-amber px-5 py-3 text-sm font-semibold text-navy disabled:opacity-60"
      >
        {status === "sending" ? "Submitting..." : "Submit Application"}
      </button>
    </form>
  );
}
