import { createClient } from "@/lib/supabase/server";
import NewConnectionForm from "./NewConnectionForm";
import { BUSINESS } from "@/lib/constants";
import { formatPKR } from "@/lib/utils";

export const metadata = { title: "New Connection | Awan Fast Fiber" };

export default async function NewConnectionPage() {
  const supabase = createClient();
  const [{ data: packages }, { data: areas }, { data: userData }] = await Promise.all([
    supabase.from("packages").select("id,speed_mbps,price").eq("is_active", true).order("sort_order"),
    supabase.from("service_areas").select("id,name").eq("is_active", true).order("name"),
    supabase.auth.getUser()
  ]);

  let profile = null;
  if (userData?.user) {
    const { data } = await supabase.from("profiles").select("*").eq("id", userData.user.id).single();
    profile = data;
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="font-display text-3xl font-bold text-white md:text-4xl">Get a New Connection</h1>
      <p className="mt-3 text-white/60">
        New connection price: <span className="font-semibold text-white">{formatPKR(BUSINESS.newConnectionPrice)}</span> — includes 50 meters
        of fiber cable and an ONT device.
      </p>
      <NewConnectionForm packages={packages ?? []} areas={areas ?? []} profile={profile} />
    </div>
  );
}
