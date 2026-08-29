"use client";
import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    setStatus(error ? "error" : "sent");
  }

  if (status === "sent") {
    return (
      <div className="mx-auto max-w-sm px-5 py-24 text-center">
        <h1 className="font-display text-2xl font-bold text-white">Check your email</h1>
        <p className="mt-3 text-sm text-white/60">
          If an account exists for {email}, we've sent a password reset link.
        </p>
        <Link href="/login" className="mt-6 inline-block text-sm text-cyan hover:underline">
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm px-5 py-24">
      <h1 className="font-display text-3xl font-bold text-white">Reset your password</h1>
      <p className="mt-2 text-sm text-white/60">Enter your email and we'll send you a reset link.</p>
      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <input
          required
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg border border-white/15 bg-navy px-4 py-2.5 text-sm text-white placeholder:text-white/30"
        />
        {status === "error" && <p className="text-sm text-red-400">Something went wrong. Please try again.</p>}
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-full bg-amber px-5 py-3 text-sm font-semibold text-navy disabled:opacity-60"
        >
          {status === "sending" ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
      <p className="mt-6 text-sm text-white/50">
        <Link href="/login" className="text-cyan hover:underline">Back to login</Link>
      </p>
    </div>
  );
}
