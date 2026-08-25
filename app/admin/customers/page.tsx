import { createClient } from "@/lib/supabase/server";
import CustomerToggle from "./CustomerToggle";

export default async function AdminCustomersPage() {
  const supabase = createClient();
  const { data: customers } = await supabase
    .from("profiles")
    .select("*, service_areas(name)")
    .eq("is_staff", false)
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white">Customers</h1>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.03] text-left text-white/50">
              <th className="px-4 py-3">Customer ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Mobile</th>
              <th className="px-4 py-3">Area</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {(customers ?? []).map((c: any) => (
              <tr key={c.id} className="border-b border-white/5">
                <td className="px-4 py-3 font-mono text-cyan">{c.customer_id}</td>
                <td className="px-4 py-3 text-white">{c.full_name}</td>
                <td className="px-4 py-3 text-white/70">{c.mobile}</td>
                <td className="px-4 py-3 text-white/70">{c.service_areas?.name ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className={c.is_active ? "text-emerald-400" : "text-red-400"}>
                    {c.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <CustomerToggle id={c.id} isActive={c.is_active} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!customers || customers.length === 0) && <p className="p-6 text-sm text-white/50">No customers yet.</p>}
      </div>
    </div>
  );
}
