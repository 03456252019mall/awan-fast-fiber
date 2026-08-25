import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import AdminLogoutButton from "./AdminLogoutButton";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/connections", label: "New Connections" },
  { href: "/admin/complaints", label: "Complaints" },
  { href: "/admin/payments", label: "Payments" },
  { href: "/admin/packages", label: "Packages" }
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase.from("profiles").select("is_staff, full_name").eq("id", user.id).single();
  if (!profile?.is_staff) redirect("/admin/login");

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-10 md:flex-row">
      <aside className="md:w-56 md:shrink-0">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs uppercase tracking-wide text-white/40">Staff</p>
          <p className="mt-1 font-semibold text-white">{profile.full_name}</p>
        </div>
        <nav className="mt-4 flex flex-row gap-2 overflow-x-auto md:flex-col">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="whitespace-nowrap rounded-lg px-4 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-4">
          <AdminLogoutButton />
        </div>
      </aside>
      <div className="flex-1">{children}</div>
    </div>
  );
}
