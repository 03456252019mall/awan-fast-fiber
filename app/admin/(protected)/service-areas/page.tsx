import { createClient } from "@/lib/supabase/server";
import AreaForm from "./AreaForm";
import AreaRow from "./AreaRow";

export default async function AdminServiceAreasPage() {
  const supabase = createClient();
  const { data: areas } = await supabase.from("service_areas").select("*").order("name");

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white">Service Areas</h1>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <p className="font-semibold text-white">Add New Area</p>
        <AreaForm />
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {(areas ?? []).map((a) => (
          <AreaRow key={a.id} area={a as any} />
        ))}
        {(!areas || areas.length === 0) && <p className="text-sm text-white/50">No service areas yet.</p>}
      </div>
    </div>
  );
}
