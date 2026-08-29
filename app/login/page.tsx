"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
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
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("Invalid email or password.");
      setStatus("idle");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-sm px-5 py-20">
      <h1 className="font-display text-3xl font-bold text-white">Welcome back</h1>
      <p className="mt-2 text-sm text-white/60">Log in to your Awan Fast Fiber account.</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <input
          required
          type="email"
          placeholder="Email"
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
        <Link href="/forgot-password" className="-mt-1 self-end text-xs text-cyan hover:underline">
          Forgot password?
        </Link>
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-full bg-amber px-5 py-3 text-sm font-semibold text-navy disabled:opacity-60"
        >
          {status === "sending" ? "Logging in..." : "Log In"}
        </button>
      </form>
      <p className="mt-6 text-sm text-white/50">
        Don't have an account? <Link href="/register" className="text-cyan hover:underline">Register</Link>
      </p>
      <p className="mt-2 text-xs text-white/30">
        Staff member? <Link href="/admin/login" className="text-cyan hover:underline">Admin login</Link>
      </p>
    </div>
  );
}
