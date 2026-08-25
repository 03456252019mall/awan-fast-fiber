"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const supabase = createClient();
    const { error } = await supabase.from("contact_messages").insert(form);
    if (error) {
      setStatus("error");
      return;
    }
    setStatus("sent");
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-cyan/30 bg-cyan/10 p-6 text-white">
        <p className="font-semibold">Message sent.</p>
        <p className="mt-2 text-sm text-white/70">We'll get back to you soon. You can also reach us directly on WhatsApp.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <input
        required
        placeholder="Full name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="rounded-lg border border-white/15 bg-navy px-4 py-2.5 text-sm text-white placeholder:text-white/30"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="rounded-lg border border-white/15 bg-navy px-4 py-2.5 text-sm text-white placeholder:text-white/30"
        />
        <input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="rounded-lg border border-white/15 bg-navy px-4 py-2.5 text-sm text-white placeholder:text-white/30"
        />
      </div>
      <input
        placeholder="Subject"
        value={form.subject}
        onChange={(e) => setForm({ ...form, subject: e.target.value })}
        className="rounded-lg border border-white/15 bg-navy px-4 py-2.5 text-sm text-white placeholder:text-white/30"
      />
      <textarea
        required
        placeholder="Message"
        rows={5}
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        className="rounded-lg border border-white/15 bg-navy px-4 py-2.5 text-sm text-white placeholder:text-white/30"
      />
      {status === "error" && <p className="text-sm text-red-400">Something went wrong. Please try again.</p>}
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-full bg-amber px-5 py-2.5 text-sm font-semibold text-navy disabled:opacity-60"
      >
        {status === "sending" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
