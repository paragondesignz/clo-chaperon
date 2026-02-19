"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { fadeInUp } from "@/lib/animations";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Message from ${form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
    );
    window.location.href = `mailto:hello@clochaperon.com?subject=${subject}&body=${body}`;
  };

  return (
    <motion.form
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto space-y-6"
    >
      <div>
        <label
          htmlFor="name"
          className="block text-sm text-text-secondary tracking-wider uppercase mb-2"
        >
          Name
        </label>
        <input
          id="name"
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-accent-gold transition-colors"
          placeholder="Your name"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm text-text-secondary tracking-wider uppercase mb-2"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-accent-gold transition-colors"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm text-text-secondary tracking-wider uppercase mb-2"
        >
          Message
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-accent-gold transition-colors resize-none"
          placeholder="Your message..."
        />
      </div>

      <button
        type="submit"
        className="w-full bg-accent-gold hover:bg-accent-gold-light text-background font-medium py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
      >
        <Send size={18} />
        <span className="tracking-wider uppercase text-sm">Send Message</span>
      </button>
    </motion.form>
  );
}
