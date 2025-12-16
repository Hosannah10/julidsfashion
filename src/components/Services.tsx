import React from "react";
import "./styles/Services.css";
import { useNavigate } from "react-router-dom";

const Services: React.FC = () => {
  const navigate = useNavigate();
  return (
    <section id="services" className="services container">
      <h2>Our Services</h2>
      <p className="subtitle">
        Explore our range of ready-made and custom fashion services designed to meet your every need.
      </p>
      <div className="services-grid">
        <div className="card">Corporate Wears</div>
        <div className="card">Trendy Casuals</div>
        <div className="card">Asoebi & Bespoke</div>
        <div className="card">Male Senator Wears</div>
        <div className="card">Kiddies’ Collection</div>
        <div className="card">Streetwear</div>
      </div>
      <p style={{ textAlign: "center", marginTop: 32 }}>
        <button className="btn-primary" onClick={() => navigate("/shop")}>View Our Wears</button>
      </p>
    </section>
  );
};

export default Services;

