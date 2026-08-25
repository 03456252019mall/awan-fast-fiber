"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Pkg = { id: string; speed_mbps: number; price: number };

export default function PaymentUploadForm({ packages }: { packages: Pkg[] }) {
  const [packageId, setPackageId] = useState("");
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let proof_storage_path: string | null = null;
    if (file) {
      const path = `${user.id}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage.from("payment-proofs").upload(path, file);
      if (uploadError) {
        setStatus("error");
        return;
      }
      proof_storage_path = path;
    }

    const { error } = await supabase.from("payments").insert({
      profile_id: user.id,
      package_id: packageId || null,
      amount: Number(amount),
      transaction_reference: reference,
      proof_storage_path
    });

    if (error) {
      setStatus("error");
      return;
    }
    setStatus("sent");
    setAmount("");
    setReference("");
    setFile(null);
  }

  if (status === "sent") {
    return (
      <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-emerald-300">
        Payment proof submitted. Our team will verify it shortly.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex max-w-lg flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <select value={packageId} onChange={(e) => setPackageId(e.target.value)} className="rounded-lg border border-white/15 bg-navy px-4 py-2.5 text-sm text-white">
        <option value="">Package (optional)</option>
        {packages.map((p) => <option key={p.id} value={p.id}>{p.speed_mbps} Mbps — Rs. {p.price}</option>)}
      </select>
      <input
        required
        type="number"
        placeholder="Amount paid (Rs.)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="rounded-lg border border-white/15 bg-navy px-4 py-2.5 text-sm text-white placeholder:text-white/30"
      />
      <input
        required
        placeholder="EasyPaisa transaction / reference ID"
        value={reference}
        onChange={(e) => setReference(e.target.value)}
        className="rounded-lg border border-white/15 bg-navy px-4 py-2.5 text-sm text-white placeholder:text-white/30"
      />
      <div>
        <label className="text-xs text-white/50">Upload payment screenshot</label>
        <input required type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="mt-1 block text-sm text-white/70" />
      </div>
      {status === "error" && <p className="text-sm text-red-400">Something went wrong. Please try again.</p>}
      <button type="submit" disabled={status === "sending"} className="self-start rounded-full bg-amber px-5 py-2.5 text-sm font-semibold text-navy disabled:opacity-60">
        {status === "sending" ? "Uploading..." : "Submit Payment Proof"}
      </button>
    </form>
  );
}
