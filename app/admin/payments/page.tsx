import { createClient } from "@/lib/supabase/server";
import { formatPKR } from "@/lib/utils";
import PaymentActions from "./PaymentActions";

export default async function AdminPaymentsPage() {
  const supabase = createClient();
  const { data: payments } = await supabase
    .from("payments")
    .select("*, profiles(full_name, customer_id)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white">Payments</h1>
      <div className="mt-6 flex flex-col gap-3">
        {(payments ?? []).map((p: any) => (
          <div key={p.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-medium text-white">
                  {p.profiles?.full_name} <span className="text-cyan">({p.profiles?.customer_id})</span>
                </p>
                <p className="text-sm text-white/60">{formatPKR(p.amount)} · Ref: {p.transaction_reference}</p>
              </div>
              <PaymentActions id={p.id} status={p.status} proofPath={p.proof_storage_path} />
            </div>
            <p className="mt-2 text-xs text-white/30">{new Date(p.created_at).toLocaleString()}</p>
          </div>
        ))}
        {(!payments || payments.length === 0) && <p className="text-sm text-white/50">No payments yet.</p>}
      </div>
    </div>
  );
}
