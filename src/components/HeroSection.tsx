import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles/HeroSection.css";

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section id="home" className="full-width hero">
      <div className="overlay">
        <div className="hero-content">
          <h1 className="hero-title">
            Step Out in Confidence. <br /> Step Out in <span>JuliD’s Fashion World.</span>
          </h1>
          <p className="hero-subtext">
            Discover timeless elegance and bespoke designs — crafted with precision and passion.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => navigate("/shop")}>
              Shop Ready-Made
            </button>
            <button className="btn-secondary" onClick={() => navigate("/custom-order-form")}>
              Request Custom Design
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
