import { formatPKR } from "@/lib/utils";
import Link from "next/link";

export type PackageRow = {
  id: string;
  speed_mbps: number;
  price: number;
  description: string | null;
  features: string[] | null;
  is_popular: boolean;
};

export default function PackageCard({ pkg }: { pkg: PackageRow }) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-6 ${
        pkg.is_popular ? "border-cyan bg-white/[0.06] shadow-lg shadow-cyan/10" : "border-white/10 bg-white/[0.03]"
      }`}
    >
      {pkg.is_popular && (
        <span className="absolute -top-3 left-6 rounded-full bg-cyan px-3 py-1 text-xs font-bold text-navy">Most Popular</span>
      )}
      <p className="font-mono text-sm text-cyan">{pkg.speed_mbps} Mbps</p>
      <p className="mt-1 font-display text-3xl font-bold text-white">
        {formatPKR(pkg.price)} <span className="text-sm font-normal text-white/50">/month</span>
      </p>
      {pkg.description && <p className="mt-3 text-sm text-white/60">{pkg.description}</p>}
      {pkg.features && pkg.features.length > 0 && (
        <ul className="mt-4 flex flex-col gap-2 text-sm text-white/70">
          {pkg.features.map((f, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan" /> {f}
            </li>
          ))}
        </ul>
      )}
      <Link
        href={`/new-connection?package=${pkg.id}`}
        className="mt-6 rounded-full bg-amber px-4 py-2.5 text-center text-sm font-semibold text-navy transition hover:brightness-110"
      >
        Choose This Package
      </Link>
    </div>
  );
}
