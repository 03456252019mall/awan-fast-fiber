import { createClient } from "@/lib/supabase/server";
import PaymentUploadForm from "./PaymentUploadForm";
import StatusBadge from "@/components/StatusBadge";
import { formatPKR } from "@/lib/utils";
import { BUSINESS } from "@/lib/constants";

export default async function PaymentsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const [{ data: payments }, { data: packages }] = await Promise.all([
    supabase.from("payments").select("*").eq("profile_id", user?.id).order("created_at", { ascending: false }),
    supabase.from("packages").select("id,speed_mbps,price").eq("is_active", true).order("sort_order")
  ]);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white">Payments</h1>
      <div className="mt-4 rounded-xl border border-cyan/30 bg-cyan/10 p-4 text-sm text-white/80">
        Pay via <span className="font-semibold text-cyan">EasyPaisa</span> to <span className="font-mono">{BUSINESS.phone}</span>, then upload your payment proof below.
      </div>

      <PaymentUploadForm packages={packages ?? []} />

      <h2 className="mt-10 font-display text-lg font-semibold text-white">Payment History</h2>
      <div className="mt-4 flex flex-col gap-3">
        {(payments ?? []).length === 0 && <p className="text-sm text-white/50">No payments yet.</p>}
        {(payments ?? []).map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div>
              <p className="text-sm font-medium text-white">{formatPKR(p.amount)}</p>
              <p className="mt-1 text-xs text-white/40">{p.transaction_reference}</p>
            </div>
            <StatusBadge status={p.status} />
          </div>
        ))}
      </div>
    </div>
  );
}
