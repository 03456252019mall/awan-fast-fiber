import { createClient } from "@/lib/supabase/server";
import SettingsForm from "./SettingsForm";

export default async function AdminSettingsPage() {
  const supabase = createClient();
  const { data: settings } = await supabase.from("website_settings").select("*").eq("id", 1).single();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white">Website Settings</h1>
      <p className="mt-2 text-sm text-white/50">
        This text appears on your public website's Home and About pages.
      </p>
      <SettingsForm settings={settings as any} />
    </div>
  );
}
