import Image from "next/image";

export default function Logo({ size = 40 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      <Image
        src="/logo.png"
        alt="Awan Fast Fiber"
        width={size}
        height={size}
        className="rounded-md"
        priority
      />
      <span className="font-display text-lg font-bold leading-none text-white">
        Awan Fast Fiber
      </span>
    </div>
  );
}
