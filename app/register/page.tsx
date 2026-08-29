"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { normalizeCustomerId, isValidCustomerId } from "@/lib/utils";

type Area = { id: string; name: string };

export default function RegisterPage() {
  const router = useRouter();
  const [areas, setAreas] = useState<Area[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    customer_id: "",
    email: "",
    mobile: "",
    password: "",
    address: "",
    service_area_id: ""
  });
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "sending">("idle");

  if (!loaded) {
    const supabase = createClient();
    supabase.from("service_areas").select("id,name").eq("is_active", true).order("name").then(({ data }) => {
      setAreas(data ?? []);
      setLoaded(true);
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const normalizedId = normalizeCustomerId(form.customer_id);
    if (!isValidCustomerId(normalizedId)) {
      setError("Customer ID must look like AFF001 (letters AFF followed by numbers).");
      return;
    }

    setStatus("sending");
    const supabase = createClient();

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password
    });

    if (signUpError || !signUpData.user) {
      setError(signUpError?.message ?? "Could not create account.");
      setStatus("idle");
      return;
    }

    const { error: profileError } = await supabase.from("profiles").insert({
      id: signUpData.user.id,
      customer_id: normalizedId,
      full_name: form.full_name,
      email: form.email,
      mobile: form.mobile,
      address: form.address,
      service_area_id: form.service_area_id || null
    });

    if (profileError) {
      if (profileError.message.includes("duplicate") || profileError.code === "23505") {
        setError("This Customer ID is already in use. Please choose another ID.");
      } else {
        setError(profileError.message);
      }
      setStatus("idle");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <h1 className="font-display text-3xl font-bold text-white">Create your account</h1>
      <p className="mt-2 text-sm text-white/60">Choose your own Customer ID, e.g. AFF001.</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <input
          required
          placeholder="Full name"
          value={form.full_name}
          onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          className="rounded-lg border border-white/15 bg-navy px-4 py-2.5 text-sm text-white placeholder:text-white/30"
        />
        <input
          required
          placeholder="Choose Customer ID (e.g. AFF001)"
          value={form.customer_id}
          onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
          className="rounded-lg border border-white/15 bg-navy px-4 py-2.5 text-sm text-white placeholder:text-white/30"
        />
        <input
          required
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="rounded-lg border border-white/15 bg-navy px-4 py-2.5 text-sm text-white placeholder:text-white/30"
        />
        <input
          required
          placeholder="Mobile number"
          value={form.mobile}
          onChange={(e) => setForm({ ...form, mobile: e.target.value })}
          className="rounded-lg border border-white/15 bg-navy px-4 py-2.5 text-sm text-white placeholder:text-white/30"
        />
        <input
          required
          type="password"
          placeholder="Password"
          minLength={6}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="rounded-lg border border-white/15 bg-navy px-4 py-2.5 text-sm text-white placeholder:text-white/30"
        />
        <textarea
          required
          placeholder="Complete address"
          rows={3}
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          className="rounded-lg border border-white/15 bg-navy px-4 py-2.5 text-sm text-white placeholder:text-white/30"
        />
        <select
          required
          value={form.service_area_id}
          onChange={(e) => setForm({ ...form, service_area_id: e.target.value })}
          className="rounded-lg border border-white/15 bg-navy px-4 py-2.5 text-sm text-white"
        >
          <option value="">Select service area…</option>
          {areas.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-full bg-amber px-5 py-3 text-sm font-semibold text-navy disabled:opacity-60"
        >
          {status === "sending" ? "Creating account..." : "Create Account"}
        </button>
      </form>
      <p className="mt-6 text-sm text-white/50">
        Already have an account? <Link href="/login" className="text-cyan hover:underline">Log in</Link>
      </p>
    </div>
  );
}
