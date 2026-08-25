"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "sending">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStatus("sending");
    const supabase = createClient();

    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError || !signInData.user) {
      setError("Invalid email or password.");
      setStatus("idle");
      return;
    }

    const { data: profile } = await supabase.from("profiles").select("is_staff").eq("id", signInData.user.id).single();
    if (!profile?.is_staff) {
      await supabase.auth.signOut();
      setError("This account does not have staff access.");
      setStatus("idle");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-sm px-5 py-24">
      <h1 className="font-display text-3xl font-bold text-white">Staff Login</h1>
      <p className="mt-2 text-sm text-white/60">Admin Dashboard access for Awan Fast Fiber staff.</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <input
          required
          type="email"
          placeholder="Staff email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg border border-white/15 bg-navy px-4 py-2.5 text-sm text-white placeholder:text-white/30"
        />
        <input
          required
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-lg border border-white/15 bg-navy px-4 py-2.5 text-sm text-white placeholder:text-white/30"
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-full bg-cyan px-5 py-3 text-sm font-semibold text-navy disabled:opacity-60"
        >
          {status === "sending" ? "Logging in..." : "Log In"}
        </button>
      </form>
      <p className="mt-6 text-xs text-white/30">
        Staff accounts are created directly in Supabase. See DEPLOYMENT.md for instructions.
      </p>
    </div>
  );
}
