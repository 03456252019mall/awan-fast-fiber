import { cn } from "@/lib/utils";

const STYLES: Record<string, string> = {
  New: "bg-skyblue/15 text-skyblue",
  Contacted: "bg-amber/15 text-amber",
  Approved: "bg-cyan/15 text-cyan",
  "Installation Scheduled": "bg-amber/15 text-amber",
  Installed: "bg-emerald-500/15 text-emerald-400",
  Completed: "bg-emerald-500/15 text-emerald-400",
  Rejected: "bg-red-500/15 text-red-400",
  "In Progress": "bg-amber/15 text-amber",
  Assigned: "bg-skyblue/15 text-skyblue",
  Resolved: "bg-emerald-500/15 text-emerald-400",
  Closed: "bg-white/10 text-white/60",
  Pending: "bg-amber/15 text-amber",
  Verified: "bg-emerald-500/15 text-emerald-400"
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn("inline-block rounded-full px-3 py-1 text-xs font-semibold", STYLES[status] ?? "bg-white/10 text-white/70")}>
      {status}
    </span>
  );
}
