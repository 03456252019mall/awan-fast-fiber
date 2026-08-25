"use client";
import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Area = { id: string; name: string };

export default function CoverageChecker({ areas }: { areas: Area[] }) {
  const [selected, setSelected] = useState("");
  const [result, setResult] = useState<"none" | "available" | "unavailable">("none");
  const [requestSent, setRequestSent] = useState(false);
  const [customAddress, setCustomAddress] = useState("");
  const [mobile, setMobile] = useState("");

  function check() {
    if (selected) {
      setResult("available");
    } else {
      setResult("unavailable");
    }
  }

  async function submitRequest() {
    const supabase = createClient();
    await supabase.from("contact_messages").insert({
      name: "Coverage request",
      phone: mobile,
      subject: "Coverage availability request",
      message: `Address: ${customAddress}`
    });
    setRequestSent(true);
  }

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-3 sm:flex-row">
        <select
          value={selected}
          onChange={(e) => {
            setSelected(e.target.value);
            setResult("none");
          }}
          className="flex-1 rounded-lg border border-white/15 bg-navy px-4 py-2.5 text-sm text-white"
        >
          <option value="">Select your area…</option>
          {areas.map((a) => (
            <option key={a.id} value={a.name}>{a.name}</option>
          ))}
        </select>
        <button onClick={check} className="rounded-full bg-cyan px-6 py-2.5 text-sm font-semibold text-navy">
          Check Availability
        </button>
      </div>

      {result === "available" && (
        <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-emerald-300">
          Great! Awan Fast Fiber is available in your area.
          <Link href="/new-connection" className="mt-3 block font-semibold underline">
            Continue to new connection →
          </Link>
        </div>
      )}

      {result === "unavailable" && !requestSent && (
        <div className="mt-6 rounded-xl border border-amber/30 bg-amber/10 p-5">
          <p className="text-amber">
            Service is currently unavailable in this area. Submit a request and our team may contact you when service becomes available.
          </p>
          <div className="mt-4 flex flex-col gap-3">
            <input
              placeholder="Your address / village"
              value={customAddress}
              onChange={(e) => setCustomAddress(e.target.value)}
              className="rounded-lg border border-white/15 bg-navy px-4 py-2.5 text-sm text-white placeholder:text-white/30"
            />
            <input
              placeholder="Mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="rounded-lg border border-white/15 bg-navy px-4 py-2.5 text-sm text-white placeholder:text-white/30"
            />
            <button onClick={submitRequest} className="self-start rounded-full bg-amber px-5 py-2.5 text-sm font-semibold text-navy">
              Submit Request
            </button>
          </div>
        </div>
      )}

      {requestSent && (
        <div className="mt-6 rounded-xl border border-cyan/30 bg-cyan/10 p-5 text-cyan">
          Thanks! Your request has been submitted — our team will contact you if service becomes available.
        </div>
      )}
    </div>
  );
}
