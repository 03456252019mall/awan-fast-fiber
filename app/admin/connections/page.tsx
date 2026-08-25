import { createClient } from "@/lib/supabase/server";
import StatusSelect from "@/components/StatusSelect";

const STATUSES = ["New", "Contacted", "Approved", "Installation Scheduled", "Installed", "Rejected", "Completed"];

export default async function AdminConnectionsPage() {
  const supabase = createClient();
  const { data: requests } = await supabase
    .from("connection_requests")
    .select("*, packages(speed_mbps, price), service_areas(name)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white">New Connection Requests</h1>
      <div className="mt-6 flex flex-col gap-3">
        {(requests ?? []).map((r: any) => (
          <div key={r.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-mono text-xs text-white/50">{r.request_code}</p>
                <p className="mt-1 font-medium text-white">{r.full_name}</p>
              </div>
              <StatusSelect table="connection_requests" id={r.id} currentStatus={r.status} options={STATUSES} />
            </div>
            <div className="mt-3 grid gap-1 text-sm text-white/60 sm:grid-cols-2">
              <p>Mobile: {r.mobile}</p>
              <p>Area: {r.service_areas?.name ?? "—"}</p>
              <p>Package: {r.packages ? `${r.packages.speed_mbps} Mbps` : "—"}</p>
              <p>Address: {r.address}</p>
            </div>
            <p className="mt-2 text-xs text-white/30">{new Date(r.created_at).toLocaleString()}</p>
          </div>
        ))}
        {(!requests || requests.length === 0) && <p className="text-sm text-white/50">No connection requests yet.</p>}
      </div>
    </div>
  );
}
