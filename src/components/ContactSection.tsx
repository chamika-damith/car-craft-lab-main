import { useState } from "react";

const ContactSection = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // TODO: Add actual form submission logic
  };

  return (
    <section id="contact" className="py-20 bg-black text-blue-100">
      <div className="container mx-auto px-4 max-w-2xl">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-100 mb-8 text-center">Contact Us</h2>
        {submitted ? (
          <div className="text-center text-blue-200 text-lg py-12">Thank you for reaching out! We'll get back to you soon.</div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl flex flex-col gap-6 border border-blue-200/20 text-blue-100">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              className="px-4 py-2 rounded-lg bg-blue-100/10 border border-blue-300/30 text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-blue-200"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              className="px-4 py-2 rounded-lg bg-blue-100/10 border border-blue-300/30 text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-blue-200"
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={form.message}
              onChange={handleChange}
              className="px-4 py-2 rounded-lg bg-blue-100/10 border border-blue-300/30 text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-blue-200 min-h-[120px]"
              required
            />
            <button type="submit" className="bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold py-2 rounded-lg shadow hover:from-blue-400 hover:to-blue-600 transition-all duration-300">
              Send Message
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default ContactSection;
