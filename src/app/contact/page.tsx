import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <section className="pt-32 pb-20 px-6">
      <h1 className="text-center text-2xl font-light tracking-[0.1em] mb-12">
        CONTACT
      </h1>

      <ContactForm />
    </section>
  );
}
