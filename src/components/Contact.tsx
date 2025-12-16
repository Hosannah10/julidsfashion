import React, { useState } from "react";
import "./styles/Contact.css";

const Contact: React.FC = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  
  const adminEmail = "julibell271@gmail.com";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent("Custom Order / Inquiry");
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\n\n${form.message}`);
    window.location.href = `mailto:${adminEmail}?subject=${subject}&body=${body}`;
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <section id="contactcontainer" className="contact container">
      <div className="contact-inner">
        <div className="contact-text">
          <h2>Contact Us</h2>
          <p>
            Have a design in mind or want to make an enquiry? <p>We’d love to hear from you!</p>
          </p>
        </div>
        <form className="contact-form" onSubmit={handleSubmit}>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" required />
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" required />
          <textarea name="message" value={form.message} onChange={handleChange} placeholder="Message" rows={6} required />
          <button className="btn-primary" type="submit">Send Message</button>
        </form>
      </div>
    </section>
  );
};

export default Contact;