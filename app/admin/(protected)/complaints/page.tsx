import { createClient } from "@/lib/supabase/server";
import StatusSelect from "@/components/StatusSelect";

const STATUSES = ["New", "In Progress", "Assigned", "Resolved", "Closed"];

export default async function AdminComplaintsPage() {
  const supabase = createClient();
  const { data: complaints } = await supabase
    .from("complaints")
    .select("*, profiles(full_name, customer_id, mobile)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white">Complaints</h1>
      <div className="mt-6 flex flex-col gap-3">
        {(complaints ?? []).map((c: any) => (
          <div key={c.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-mono text-xs text-white/50">{c.complaint_code}</p>
                <p className="mt-1 font-medium text-white">
                  {c.profiles?.full_name} <span className="text-cyan">({c.profiles?.customer_id})</span>
                </p>
              </div>
              <StatusSelect table="complaints" id={c.id} currentStatus={c.status} options={STATUSES} />
            </div>
            <p className="mt-3 text-sm text-white/70"><span className="text-white/40">Category:</span> {c.category}</p>
            <p className="mt-1 text-sm text-white/60">{c.details}</p>
            <p className="mt-2 text-xs text-white/30">{c.profiles?.mobile} · {new Date(c.created_at).toLocaleString()}</p>
          </div>
        ))}
        {(!complaints || complaints.length === 0) && <p className="text-sm text-white/50">No complaints yet.</p>}
      </div>
    </div>
  );
}
