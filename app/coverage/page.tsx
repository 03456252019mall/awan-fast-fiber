import { createClient } from "@/lib/supabase/server";
import CoverageChecker from "./CoverageChecker";

export const metadata = { title: "Coverage | Awan Fast Fiber" };

export default async function CoveragePage() {
  const supabase = createClient();
  const { data: areas } = await supabase.from("service_areas").select("id,name").eq("is_active", true).order("name");

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="font-display text-3xl font-bold text-white md:text-4xl">Check Coverage</h1>
      <p className="mt-3 text-white/60">Select your area to see if Awan Fast Fiber is available near you.</p>
      <CoverageChecker areas={areas ?? []} />
    </div>
  );
}
