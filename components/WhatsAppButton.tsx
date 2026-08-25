"use client";
import { whatsappLink } from "@/lib/constants";

export default function WhatsAppButton({
  message = "Hello Awan Fast Fiber, I need help.",
  floating = false
}: {
  message?: string;
  floating?: boolean;
}) {
  const href = whatsappLink(message);
  if (floating) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/30 transition hover:scale-105"
      >
        <svg viewBox="0 0 32 32" className="h-7 w-7 fill-current">
          <path d="M16.001 3C9.373 3 4 8.373 4 15c0 2.386.7 4.607 1.906 6.475L4 29l7.72-1.865A11.93 11.93 0 0 0 16.001 27C22.629 27 28 21.627 28 15S22.629 3 16.001 3zm0 21.6a9.55 9.55 0 0 1-4.87-1.335l-.35-.207-4.58 1.107 1.12-4.463-.228-.362A9.56 9.56 0 1 1 25.56 15c0 5.294-4.276 9.6-9.559 9.6zm5.24-7.166c-.287-.144-1.698-.838-1.961-.934-.263-.096-.454-.144-.646.144-.192.287-.742.934-.909 1.126-.168.192-.335.216-.622.072-.287-.144-1.212-.447-2.31-1.427-.854-.762-1.43-1.703-1.598-1.99-.168-.287-.018-.442.126-.585.13-.13.287-.335.43-.503.144-.168.192-.287.287-.479.096-.192.048-.36-.024-.503-.072-.144-.646-1.559-.886-2.135-.233-.56-.47-.484-.646-.493-.168-.008-.36-.01-.552-.01-.192 0-.503.072-.766.36-.263.287-1.004.982-1.004 2.394 0 1.412 1.028 2.777 1.172 2.969.144.192 2.023 3.088 4.902 4.33.685.296 1.22.472 1.636.604.687.219 1.312.188 1.807.114.551-.082 1.698-.694 1.938-1.365.24-.67.24-1.245.168-1.365-.072-.12-.263-.192-.55-.336z" />
        </svg>
      </a>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
    >
      WhatsApp Us
    </a>
  );
}
