"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(form.subject || `Message from ${form.name}`);
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
      className="max-w-xl mx-auto"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
        <div>
          <label htmlFor="name" className="sr-only">Name</label>
          <input
            id="name"
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input-underline"
            placeholder="Name"
          />
        </div>

        <div>
          <label htmlFor="email" className="sr-only">Email</label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="input-underline"
            placeholder="Email"
          />
        </div>
      </div>

      <div className="mt-8">
        <label htmlFor="subject" className="sr-only">Subject</label>
        <input
          id="subject"
          type="text"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          className="input-underline"
          placeholder="Subject"
        />
      </div>

      <div className="mt-8">
        <label htmlFor="message" className="sr-only">Message</label>
        <textarea
          id="message"
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="input-underline resize-none"
          placeholder="Message"
        />
      </div>

      <button
        type="submit"
        className="mt-10 w-full bg-black text-white py-4 px-6 text-sm tracking-wider uppercase transition-opacity duration-300 hover:opacity-80"
      >
        Submit
      </button>
    </motion.form>
  );
}
