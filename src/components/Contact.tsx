import React, { useState, useEffect } from "react";
import "./styles/Contact.css";
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { DUMMY_BASE } from "../services/api";

const Contact: React.FC = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const { showToast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const adminEmail = "hosannahpatrick@gmail.com";

  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch(`${DUMMY_BASE}/contact/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      showToast("Message sent successfully");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      showToast("Failed to send message");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contactcontainer" className="contact container">
      <div className="contact-inner">
        <div className="contact-text">
          <h2>Contact Us</h2>
          <p>
            Have a design in mind or want to make an inquiry? <p>We’d love to hear from you!</p>
          </p>
        </div>
        <form className="contact-form" onSubmit={handleSubmit}>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" required />
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" required />
          <textarea name="message" value={form.message} onChange={handleChange} placeholder="Message" rows={6} required />
          <button className="btn-primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;