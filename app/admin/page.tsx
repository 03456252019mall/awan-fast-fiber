import { createClient } from "@/lib/supabase/server";

async function count(supabase: any, table: string, filter?: Record<string, any>) {
  let query = supabase.from(table).select("*", { count: "exact", head: true });
  if (filter) {
    for (const [k, v] of Object.entries(filter)) query = query.eq(k, v);
  }
  const { count: c } = await query;
  return c ?? 0;
}

export default async function AdminOverview() {
  const supabase = createClient();

  const [
    totalCustomers,
    activeCustomers,
    newConnections,
    pendingComplaints,
    resolvedComplaints,
    pendingPayments,
    activePackages
  ] = await Promise.all([
    count(supabase, "profiles", { is_staff: false }),
    count(supabase, "profiles", { is_staff: false, is_active: true }),
    count(supabase, "connection_requests", { status: "New" }),
    count(supabase, "complaints", { status: "New" }),
    count(supabase, "complaints", { status: "Resolved" }),
    count(supabase, "payments", { status: "Pending" }),
    count(supabase, "packages", { is_active: true })
  ]);

  const cards = [
    { label: "Total Customers", value: totalCustomers },
    { label: "Active Customers", value: activeCustomers },
    { label: "New Connections", value: newConnections },
    { label: "Pending Complaints", value: pendingComplaints },
    { label: "Resolved Complaints", value: resolvedComplaints },
    { label: "Pending Payments", value: pendingPayments },
    { label: "Active Packages", value: activePackages }
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs uppercase tracking-wide text-white/40">{c.label}</p>
            <p className="mt-2 font-display text-3xl font-bold text-white">{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
