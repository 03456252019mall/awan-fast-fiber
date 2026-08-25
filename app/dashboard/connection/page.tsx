import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import StatusBadge from "@/components/StatusBadge";

export default async function ConnectionStatusPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: requests } = await supabase
    .from("connection_requests")
    .select("*, packages(speed_mbps, price)")
    .eq("profile_id", user?.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-white">Connection Requests</h1>
        <Link href="/new-connection" className="rounded-full bg-amber px-4 py-2 text-sm font-semibold text-navy">
          + New Request
        </Link>
      </div>
      <div className="mt-6 flex flex-col gap-3">
        {(requests ?? []).length === 0 && <p className="text-sm text-white/50">No connection requests yet.</p>}
        {(requests ?? []).map((r: any) => (
          <div key={r.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between">
              <p className="font-mono text-xs text-white/50">{r.request_code}</p>
              <StatusBadge status={r.status} />
            </div>
            {r.packages && <p className="mt-2 text-sm text-white/70">{r.packages.speed_mbps} Mbps — Rs. {r.packages.price}/mo</p>}
            <p className="mt-2 text-xs text-white/30">{new Date(r.created_at).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
