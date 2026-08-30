import { createClient } from "@/lib/supabase/server";
import PackageForm from "./PackageForm";
import PackageRow from "./PackageRow";

export default async function AdminPackagesPage() {
  const supabase = createClient();
  const { data: packages } = await supabase.from("packages").select("*").order("sort_order");

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white">Packages</h1>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <p className="font-semibold text-white">Add New Package</p>
        <PackageForm />
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {(packages ?? []).map((p) => (
          <PackageRow key={p.id} pkg={p as any} />
        ))}
      </div>
    </div>
  );
}
