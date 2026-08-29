import { createClient } from "@/lib/supabase/server";
import BannerForm from "./BannerForm";
import BannerRow from "./BannerRow";

export default async function AdminBannersPage() {
  const supabase = createClient();
  const { data: banners } = await supabase.from("banners").select("*").order("sort_order");

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white">Banners</h1>
      <p className="mt-2 text-sm text-white/50">
        Banners rotate at the top of the homepage. Paste an image URL (e.g. from a photo host) or leave it blank for a plain text banner.
      </p>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <p className="font-semibold text-white">Add New Banner</p>
        <BannerForm />
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {(banners ?? []).map((b) => (
          <BannerRow key={b.id} banner={b as any} />
        ))}
        {(!banners || banners.length === 0) && <p className="text-sm text-white/50">No banners yet.</p>}
      </div>
    </div>
  );
}
