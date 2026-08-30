"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import StatusBadge from "@/components/StatusBadge";

export default function PaymentActions({ id, status, proofPath }: { id: string; status: string; proofPath: string | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [proofUrl, setProofUrl] = useState<string | null>(null);

  async function viewProof() {
    if (!proofPath) return;
    const supabase = createClient();
    const { data } = await supabase.storage.from("payment-proofs").createSignedUrl(proofPath, 300);
    if (data?.signedUrl) setProofUrl(data.signedUrl);
  }

  async function setStatus(newStatus: "Verified" | "Rejected") {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("payments").update({
      status: newStatus,
      verified_by: user?.id,
      verified_at: new Date().toISOString()
    }).eq("id", id);
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <StatusBadge status={status} />
      <div className="flex gap-2">
        {proofPath && (
          <button onClick={viewProof} className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/70 hover:text-white">
            View Proof
          </button>
        )}
        {status === "Pending" && (
          <>
            <button onClick={() => setStatus("Verified")} disabled={loading} className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-300 disabled:opacity-50">
              Verify
            </button>
            <button onClick={() => setStatus("Rejected")} disabled={loading} className="rounded-full bg-red-500/20 px-3 py-1 text-xs text-red-300 disabled:opacity-50">
              Reject
            </button>
          </>
        )}
      </div>
      {proofUrl && (
        <a href={proofUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-cyan underline">
          Open payment screenshot →
        </a>
      )}
    </div>
  );
}
