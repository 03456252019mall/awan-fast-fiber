import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "./LogoutButton";

const NAV = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/complaints", label: "Complaints" },
  { href: "/dashboard/connection", label: "Connection Status" },
  { href: "/dashboard/payments", label: "Payments" }
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();

  if (!profile) redirect("/login");

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-10 md:flex-row">
      <aside className="md:w-56 md:shrink-0">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="font-semibold text-white">{profile.full_name}</p>
          <p className="mt-1 font-mono text-xs text-cyan">{profile.customer_id}</p>
        </div>
        <nav className="mt-4 flex flex-row gap-2 overflow-x-auto md:flex-col">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-lg px-4 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-4">
          <LogoutButton />
        </div>
      </aside>
      <div className="flex-1">{children}</div>
    </div>
  );
}
