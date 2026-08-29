"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export type Banner = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  button_text: string | null;
  button_url: string | null;
};

export default function BannerCarousel({ banners }: { banners: Banner[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % banners.length), 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) return null;
  const banner = banners[index];

  return (
    <section className="border-b border-white/10 bg-white/[0.02]">
      <div className="mx-auto max-w-6xl px-5 py-6">
        <div
          className="relative flex min-h-[160px] flex-col justify-center overflow-hidden rounded-2xl border border-cyan/20 bg-gradient-to-r from-navy-light to-navy p-6 sm:min-h-[140px] sm:flex-row sm:items-center sm:justify-between"
          style={
            banner.image_url
              ? { backgroundImage: `linear-gradient(90deg, rgba(10,25,48,0.92), rgba(10,25,48,0.75)), url(${banner.image_url})`, backgroundSize: "cover", backgroundPosition: "center" }
              : undefined
          }
        >
          <div>
            <p className="font-display text-xl font-bold text-white">{banner.title}</p>
            {banner.description && <p className="mt-1 max-w-xl text-sm text-white/70">{banner.description}</p>}
          </div>
          {banner.button_text && banner.button_url && (
            <Link
              href={banner.button_url}
              className="mt-4 inline-block shrink-0 rounded-full bg-amber px-5 py-2.5 text-sm font-semibold text-navy hover:brightness-110 sm:mt-0"
            >
              {banner.button_text}
            </Link>
          )}
        </div>
        {banners.length > 1 && (
          <div className="mt-3 flex justify-center gap-1.5">
            {banners.map((b, i) => (
              <button
                key={b.id}
                onClick={() => setIndex(i)}
                aria-label={`Show banner ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-cyan" : "w-1.5 bg-white/20"}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
