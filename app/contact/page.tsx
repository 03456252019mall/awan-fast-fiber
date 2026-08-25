import { BUSINESS, whatsappLink } from "@/lib/constants";
import ContactForm from "./ContactForm";

export const metadata = { title: "Contact Us | Awan Fast Fiber" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <h1 className="font-display text-3xl font-bold text-white md:text-4xl">Contact Us</h1>
      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm text-white/40">Phone / WhatsApp</p>
            <a href={`tel:${BUSINESS.phone}`} className="mt-1 block text-lg font-semibold text-white">{BUSINESS.phone}</a>
            <a
              href={whatsappLink("Hello Awan Fast Fiber, I need technical support.")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white"
            >
              Chat on WhatsApp
            </a>
          </div>
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm text-white/40">Email</p>
            <a href={`mailto:${BUSINESS.email}`} className="mt-1 block font-medium text-white">{BUSINESS.email}</a>
          </div>
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm text-white/40">Office</p>
            <p className="mt-1 font-medium text-white">{BUSINESS.office}</p>
          </div>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
