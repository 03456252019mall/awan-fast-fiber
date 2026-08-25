import { createClient } from "@/lib/supabase/server";
import PackageCard from "@/components/PackageCard";

export const metadata = { title: "Packages | Awan Fast Fiber" };

export default async function PackagesPage() {
  const supabase = createClient();
  const { data: packages } = await supabase
    .from("packages")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <h1 className="font-display text-3xl font-bold text-white md:text-4xl">Internet Packages</h1>
      <p className="mt-3 max-w-xl text-white/60">
        Choose the speed that fits your home or business. All packages are billed monthly.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {(packages ?? []).map((pkg) => (
          <PackageCard key={pkg.id} pkg={pkg as any} />
        ))}
      </div>
      {(!packages || packages.length === 0) && (
        <p className="mt-10 text-white/50">Packages will appear here once added from the admin dashboard.</p>
      )}
    </div>
  );
}
