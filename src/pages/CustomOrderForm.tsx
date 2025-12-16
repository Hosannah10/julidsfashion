import React, { useState, useRef, useEffect } from "react";
import "./styles/CustomOrderForm.css";
import { useToast } from "../context/ToastContext";
import { createCustomOrder, notifyCustomOrderPlaced } from "../services/api";
import { Link } from "react-router-dom";
import { type OrderStatus } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Helmet } from "react-helmet-async";

const CustomOrderForm: React.FC = () => {
  const { showToast } = useToast();
  const { user } = useAuth();

  let status = 'pending' as OrderStatus;
  
  const fileRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    description: "",
    image: null as File | null,
    status: status
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Auto-fill user details on mount
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || ""
      }));
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name } = e.target;

    if (name === "image") {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0] ?? null;
      setFormData(prev => ({ ...prev, image: file }));
    } else {
      const value = e.target.value;
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("email", formData.email);
      form.append("phone", formData.phone);
      form.append("description", formData.description);
      form.append("status", formData.status);
      if (formData.image) form.append("image", formData.image);

      const created = await createCustomOrder(form);

      // notify backend (pass email)
      try {
        await notifyCustomOrderPlaced(created?.email || formData.email);
      } catch (notifyErr) {
        console.warn("Email notification failed:", notifyErr);
      }


      showToast("✅ Your custom order request has been sent!");

      // Reset all fields
      setFormData(prev => ({
        ...prev,
        phone: "",
        description: "",
        image: null
      }));

      // Clear file input
      if (fileRef.current) {
        fileRef.current.value = "";
      }

    } catch (err: any) {
      console.error(err);
      showToast(err?.response?.data?.detail || "❌ Something went wrong. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="custom-container">
      <Helmet>
        <title>Custom & Bespoke Orders | JuliD’s Fashion World</title>
        <meta
          name="description"
          content="Place custom and bespoke fashion orders including asoebi, bridal, and tailored outfits at JuliD’s Fashion World."
        />
        <link rel="canonical" href="https://julidsfashion.com/custom-order-form" />
      </Helmet>

      <div className="custom-card">
        <h1>Request a Custom Design</h1>
        <p>
          Didn’t find what you’re looking for? Describe your desired outfit
          below — you can even attach a reference image.
        </p>

        <form onSubmit={handleSubmit}>
          {/* NAME (readonly) */}
          <input
            type="text"
            name="name"
            value={formData.name}
            disabled
            placeholder="Full Name"
          />

          {/* EMAIL (readonly) */}
          <input
            type="email"
            name="email"
            value={formData.email}
            disabled
            placeholder="Email Address"
          />

          {/* PHONE */}
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Describe your desired wear. Kindly include your measurements (e.g Bust: 36, Waist: 28, Hips: 40, etc)."
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>

          {/* FILE INPUT */}
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            ref={fileRef}
          />

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Request"}
          </button>
        </form>

        <br />
        <p className="custom-orders-link">
          View your <Link to="/custom-orders" className="gold-link">Custom Orders</Link>
        </p>
      </div>
    </section>
  );
};

export default CustomOrderForm;
