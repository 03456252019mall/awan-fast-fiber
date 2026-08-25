import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import StatusBadge from "@/components/StatusBadge";

export default async function ComplaintsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: complaints } = await supabase
    .from("complaints")
    .select("*")
    .eq("profile_id", user?.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-white">Your Complaints</h1>
        <Link href="/dashboard/complaints/new" className="rounded-full bg-amber px-4 py-2 text-sm font-semibold text-navy">
          + New Complaint
        </Link>
      </div>
      <div className="mt-6 flex flex-col gap-3">
        {(complaints ?? []).length === 0 && <p className="text-sm text-white/50">You haven't submitted any complaints yet.</p>}
        {(complaints ?? []).map((c) => (
          <div key={c.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between">
              <p className="font-mono text-xs text-white/50">{c.complaint_code}</p>
              <StatusBadge status={c.status} />
            </div>
            <p className="mt-2 font-medium text-white">{c.category}</p>
            <p className="mt-1 text-sm text-white/60">{c.details}</p>
            <p className="mt-2 text-xs text-white/30">{new Date(c.created_at).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
