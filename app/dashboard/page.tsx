import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import StatusBadge from "@/components/StatusBadge";
import { formatPKR } from "@/lib/utils";

export default async function DashboardOverview() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: profile }, { data: complaints }, { data: payments }, { data: area }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("complaints").select("*").eq("profile_id", user.id).order("created_at", { ascending: false }).limit(5),
    supabase.from("payments").select("*").eq("profile_id", user.id).order("created_at", { ascending: false }).limit(5),
    supabase.from("profiles").select("service_area_id, service_areas(name)").eq("id", user.id).single()
  ]);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white">Welcome, {profile?.full_name}</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs uppercase tracking-wide text-white/40">Customer ID</p>
          <p className="mt-1 font-mono text-lg text-cyan">{profile?.customer_id}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs uppercase tracking-wide text-white/40">Account Status</p>
          <p className="mt-1 text-lg text-white">{profile?.is_active ? "Active" : "Inactive"}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-4">
        <Link href="/dashboard/complaints/new" className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center text-sm font-medium text-white hover:border-cyan/40">
          Submit Complaint
        </Link>
        <Link href="/dashboard/connection" className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center text-sm font-medium text-white hover:border-cyan/40">
          Connection Status
        </Link>
        <Link href="/dashboard/payments" className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center text-sm font-medium text-white hover:border-cyan/40">
          Upload Payment
        </Link>
        <a href="https://wa.me/923456252019" target="_blank" rel="noopener noreferrer" className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center text-sm font-medium text-white hover:border-cyan/40">
          WhatsApp Support
        </a>
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-white">Recent Complaints</h2>
          <Link href="/dashboard/complaints" className="text-sm text-cyan hover:underline">View all →</Link>
        </div>
        <div className="mt-4 flex flex-col gap-2">
          {(complaints ?? []).length === 0 && <p className="text-sm text-white/50">No complaints yet.</p>}
          {(complaints ?? []).map((c) => (
            <div key={c.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div>
                <p className="font-mono text-xs text-white/50">{c.complaint_code}</p>
                <p className="text-sm text-white">{c.category}</p>
              </div>
              <StatusBadge status={c.status} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-white">Recent Payments</h2>
          <Link href="/dashboard/payments" className="text-sm text-cyan hover:underline">View all →</Link>
        </div>
        <div className="mt-4 flex flex-col gap-2">
          {(payments ?? []).length === 0 && <p className="text-sm text-white/50">No payments yet.</p>}
          {(payments ?? []).map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm text-white">{formatPKR(p.amount)}</p>
              <StatusBadge status={p.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
